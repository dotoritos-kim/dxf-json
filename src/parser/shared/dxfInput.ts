import { binaryDxfToLines, isBinaryDxf } from './binaryDxf.ts'
import { assertAsciiDxf } from './asciiDxf.ts'

export type DxfInputToLinesOptions = {
  encoding?: string
  encodingFailureFatal?: boolean
}

/**
 * Convert ASCII DXF text to scanner lines.
 */
export function asciiDxfToLines(text: string): string[] {
  assertAsciiDxf(text)
  const normalized = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  return normalized.split(/\r\n|\r|\n/g)
}

/**
 * Convert raw DXF bytes to scanner lines (ASCII or binary).
 */
export function dxfInputToLines(
  data: Uint8Array,
  options: DxfInputToLinesOptions = {},
): string[] {
  if (isBinaryDxf(data)) {
    return binaryDxfToLines(data, {
      encoding: options.encoding,
      encodingFailureFatal: options.encodingFailureFatal,
    })
  }

  const text = new TextDecoder(options.encoding ?? 'utf-8', {
    fatal: options.encodingFailureFatal ?? false,
  }).decode(data)
  return asciiDxfToLines(text)
}
