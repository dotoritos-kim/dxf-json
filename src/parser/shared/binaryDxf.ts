/**
 * Binary DXF decoder. See AutoCAD DXF Reference — "About Binary DXF Files".
 * Group/value typing follows ezdxf's `binary_tags_loader`.
 */

export const BINARY_DXF_SENTINEL = new Uint8Array([
  ...new TextEncoder().encode('AutoCAD Binary DXF\r\n'),
  0x1a,
  0x00,
])

const BYTES_CODES = new Set(range(290, 300))
const INT16_CODES = new Set([
  ...range(60, 80),
  ...range(170, 180),
  ...range(270, 290),
  ...range(370, 390),
  ...range(400, 410),
  ...range(1060, 1071),
])
const INT32_CODES = new Set([
  ...range(90, 100),
  ...range(420, 430),
  ...range(440, 460),
  1071,
])
const INT64_CODES = new Set(range(160, 170))
const DOUBLE_CODES = new Set([
  ...range(10, 60),
  ...range(110, 150),
  ...range(210, 240),
  ...range(460, 470),
  ...range(1010, 1060),
])
const BINARY_DATA_CODES = new Set([
  ...range(310, 320),
  1004,
])

export type BinaryDxfDecodeOptions = {
  /** Fallback when $DWGCODEPAGE is missing (pre-R2007 files). */
  encoding?: string
  /** Passed to {@link TextDecoder} for string-valued groups. */
  encodingFailureFatal?: boolean
}

export function isBinaryDxf(data: Uint8Array): boolean {
  if (data.length < BINARY_DXF_SENTINEL.length) return false
  for (let i = 0; i < BINARY_DXF_SENTINEL.length; i++) {
    if (data[i] !== BINARY_DXF_SENTINEL[i]) return false
  }
  return true
}

export function isBinaryDxfText(text: string): boolean {
  const t = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  return t.startsWith('AutoCAD Binary DXF')
}

/**
 * Decode a binary DXF file into line pairs compatible with {@link DxfArrayScanner}.
 */
export function binaryDxfToLines(
  data: Uint8Array,
  options: BinaryDxfDecodeOptions = {},
): string[] {
  if (!isBinaryDxf(data)) {
    throw new Error('Not a binary DXF file.')
  }

  const { dxfVersion, encoding, r12 } = scanBinaryDxfParams(
    data,
    options.encoding ?? 'windows-1252',
    options.encodingFailureFatal ?? false,
  )
  const lines: string[] = []
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const decoders = createDecoderCache(options.encodingFailureFatal ?? false)
  let index = BINARY_DXF_SENTINEL.length

  while (index < data.length) {
    const [code, nextIndex] = readGroupCode(data, index, r12)
    index = nextIndex

    const [value, valueIndex] = readValue(
      data,
      view,
      index,
      code,
      encoding,
      decoders,
    )
    index = valueIndex

    lines.push(String(code), value)

    if (code === 0 && value === 'EOF') {
      break
    }
  }

  if (lines.length < 2 || lines[lines.length - 1] !== 'EOF') {
    throw new Error(
      `Binary DXF ended without EOF group (version ${dxfVersion}, offset ${index}).`,
    )
  }

  return lines
}

function scanBinaryDxfParams(
  data: Uint8Array,
  fallbackEncoding: string,
  encodingFailureFatal: boolean,
) {
  const r12 = !detectTwoByteGroupCodes(data)
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const decoders = createDecoderCache(encodingFailureFatal)
  let dxfVersion = 'AC1009'
  let codepage: string | undefined
  let encoding = fallbackEncoding
  let index = BINARY_DXF_SENTINEL.length
  const limit = Math.min(data.length, index + 8192)

  while (index < limit) {
    const [code, valueStart] = readGroupCode(data, index, r12)
    const [value, valueEnd] = readValue(
      data,
      view,
      valueStart,
      code,
      encoding,
      decoders,
    )

    if (code === 9 && value === '$ACADVER') {
      const [verCode, verStart] = readGroupCode(data, valueEnd, r12)
      const [ver, verEnd] = readValue(
        data,
        view,
        verStart,
        verCode,
        'utf-8',
        decoders,
      )
      if (verCode === 1) {
        dxfVersion = ver
      }
      index = verEnd
      continue
    }

    if (code === 9 && value === '$DWGCODEPAGE') {
      const [cpCode, cpStart] = readGroupCode(data, valueEnd, r12)
      const [cp, cpEnd] = readValue(
        data,
        view,
        cpStart,
        cpCode,
        'ascii',
        decoders,
      )
      if (cpCode === 3 || cpCode === 1) {
        codepage = cp
      }
      index = cpEnd
      continue
    }

    index = valueEnd
    if (code === 0 && (value === 'ENDSEC' || value === 'EOF')) {
      break
    }
  }

  if (dxfVersion >= 'AC1021') {
    encoding = 'utf-8'
  } else if (codepage) {
    encoding = mapCodepage(codepage) ?? fallbackEncoding
  }

  return { dxfVersion, encoding, r12 }
}

function detectTwoByteGroupCodes(data: Uint8Array) {
  const index = BINARY_DXF_SENTINEL.length
  if (data.length < index + 9) return true

  if (data[index] === 0 && data[index + 1] === 0) {
    return decodeAscii(data.subarray(index + 2, index + 9)) === 'SECTION'
  }

  if (data[index] === 0) {
    return decodeAscii(data.subarray(index + 1, index + 8)) !== 'SECTION'
  }

  return true
}

function readGroupCode(
  data: Uint8Array,
  index: number,
  r12: boolean,
): [code: number, nextIndex: number] {
  if (r12) {
    let code = data[index]
    index += 1
    if (code === 255) {
      code = data[index] | (data[index + 1] << 8)
      index += 2
    }
    return [code, index]
  }

  const code = data[index] | (data[index + 1] << 8)
  return [code, index + 2]
}

function readValue(
  data: Uint8Array,
  view: DataView,
  index: number,
  code: number,
  encoding: string,
  decoders: DecoderCache,
): [value: string, nextIndex: number] {
  if (BINARY_DATA_CODES.has(code)) {
    // Binary DXF stores chunk length in a single byte (max 255); larger
    // payloads are split across multiple 310/1004 groups in the source file.
    const length = data[index]
    index += 1
    const chunk = data.subarray(index, index + length)
    index += length
    return [bytesToHex(chunk), index]
  }

  if (BYTES_CODES.has(code)) {
    return [data[index] !== 0 ? '1' : '0', index + 1]
  }

  if (INT16_CODES.has(code)) {
    return [String(view.getInt16(index, true)), index + 2]
  }

  if (INT32_CODES.has(code)) {
    return [String(view.getInt32(index, true)), index + 4]
  }

  if (INT64_CODES.has(code)) {
    return [String(Number(view.getBigInt64(index, true))), index + 8]
  }

  if (DOUBLE_CODES.has(code)) {
    return [String(view.getFloat64(index, true)), index + 8]
  }

  const start = index
  let end = start
  while (end < data.length && data[end] !== 0) end++
  const value = getDecoder(decoders, encoding).decode(data.subarray(start, end))
  return [value, end + 1]
}

type DecoderCache = {
  fatal: boolean
  byEncoding: Map<string, TextDecoder>
}

function createDecoderCache(encodingFailureFatal: boolean): DecoderCache {
  return { fatal: encodingFailureFatal, byEncoding: new Map() }
}

function getDecoder(cache: DecoderCache, encoding: string) {
  let decoder = cache.byEncoding.get(encoding)
  if (!decoder) {
    decoder = new TextDecoder(encoding, { fatal: cache.fatal })
    cache.byEncoding.set(encoding, decoder)
  }
  return decoder
}

function range(start: number, end: number) {
  const values: number[] = []
  for (let code = start; code < end; code++) {
    values.push(code)
  }
  return values
}

function decodeAscii(data: Uint8Array) {
  return new TextDecoder('ascii').decode(data)
}

function bytesToHex(data: Uint8Array) {
  let hex = ''
  for (let i = 0; i < data.length; i++) {
    hex += data[i].toString(16).padStart(2, '0')
  }
  return hex
}

function mapCodepage(codepage: string) {
  const match = /^ANSI_(\d+)$/i.exec(codepage)
  if (!match) return undefined

  const code = match[1]
  if (code === '1252') return 'windows-1252'
  if (code === '949') return 'euc-kr'
  return `windows-${code}`
}
