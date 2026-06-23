import { DxfArrayScanner } from './DxfArrayScanner.ts'
import { parseHeader } from './header/parser.ts'
import { parseDxfClasses } from './classes/parser.ts'
import { parseTables } from './tables/parser.ts'
import { parseBlocks } from './blocks/parser.ts'
import { parseEntities } from './entities/parser.ts'
import { parseObjects } from './objects/parser.ts'
import { parseThumbnailImage } from './thumbnailImage/parser.ts'
import { isMatched } from './shared/isMatched.ts'
import type { ParsedDxf } from './types.ts'
import { asciiDxfToLines, dxfInputToLines } from './shared/dxfInput.ts'
import type { Readable } from 'readable-stream'

/** Options for {@link DxfParser} construction. */
export class DxfParserOptions {
  /** Encoding label.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
   */
  encoding: string = 'utf-8'
  /** Throw `TypeError` when encountering invalid encoded data when true. When false, the decoder
   * will substitute malformed data with a replacement character.
   */
  encodingFailureFatal: boolean = false
  /** Thumbnail image format.
   * - 'base64': Base64-encoded string (default, ready for web display)
   * - 'hex': Raw hexadecimal string
   * - 'buffer': Node.js Buffer object
   */
  thumbnailImageFormat: 'base64' | 'hex' | 'buffer' = 'base64'
}

export class DxfParser extends EventTarget {
  private readonly _options: DxfParserOptions

  constructor(options: Partial<DxfParserOptions> = {}) {
    super()
    const defaults = new DxfParserOptions()
    this._options = Object.assign(defaults, options)
  }
  parseSync(dxfString: string, isDebugMode = false): ParsedDxf {
    return this.parseLines(asciiDxfToLines(dxfString), isDebugMode)
  }

  parseBuffer(data: Uint8Array, isDebugMode = false): ParsedDxf {
    return this.parseLines(
      dxfInputToLines(data, {
        encoding: this._options.encoding,
        encodingFailureFatal: this._options.encodingFailureFatal,
      }),
      isDebugMode,
    )
  }

  parseStream(stream: Readable) {
    const chunks: Uint8Array[] = []
    const self = this
    return new Promise<ParsedDxf>((res, rej) => {
      stream.on('data', (chunk: string | Uint8Array) => {
        if (typeof chunk === 'string') {
          chunks.push(new TextEncoder().encode(chunk))
        } else {
          chunks.push(chunk)
        }
      })
      stream.on('end', () => {
        try {
          const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
          const data = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            data.set(chunk, offset)
            offset += chunk.length
          }
          res(self.parseBuffer(data))
        } catch (err) {
          rej(err)
        }
      })
      stream.on('error', (err) => {
        rej(err)
      })
    })
  }

  /**
   * Fetch a DXF from `url` and parse it. Supports ASCII and binary DXF.
   *
   * @throws {Error} When the HTTP response is not ok, the body is empty, or parsing fails.
   */
  async parseFromUrl(url: string, init?: RequestInit | undefined) {
    const response = await fetch(url, init)

    if (!response.ok) {
      throw new Error(`Failed to fetch DXF: ${response.status} ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength === 0) {
      throw new Error(`Failed to fetch DXF: empty response body from ${url}`)
    }

    return this.parseBuffer(new Uint8Array(buffer))
  }

  private parseLines(dxfLinesArray: string[], isDebugMode = false) {
    const scanner = new DxfArrayScanner(dxfLinesArray, isDebugMode)
    if (!scanner.hasNext()) {
      throw Error('Empty file')
    }

    return this.parseAll(scanner)
  }

  private parseAll(scanner: DxfArrayScanner) {
    const dxf: ParsedDxf = {
      // @ts-ignore
      header: {},
      blocks: {},
      entities: [],
      tables: {},
      objects: {
        byName: {},
        byTree: undefined,
      },
    }
    let curr = scanner.next()

    while (!isMatched(curr, 0, 'EOF')) {
      if (isMatched(curr, 0, 'SECTION')) {
        curr = scanner.next()

        if (isMatched(curr, 2, 'HEADER')) {
          curr = scanner.next()
          dxf.header = parseHeader(curr, scanner)
        } else if (isMatched(curr, 2, 'CLASSES')) {
          curr = scanner.next()
          parseDxfClasses(curr, scanner, dxf)
        } else if (isMatched(curr, 2, 'BLOCKS')) {
          curr = scanner.next()
          dxf.blocks = parseBlocks(curr, scanner)
        } else if (isMatched(curr, 2, 'ENTITIES')) {
          curr = scanner.next()
          dxf.entities = parseEntities(curr, scanner)
        } else if (isMatched(curr, 2, 'TABLES')) {
          curr = scanner.next()
          dxf.tables = parseTables(curr, scanner)
        } else if (isMatched(curr, 2, 'OBJECTS')) {
          curr = scanner.next()
          dxf.objects = parseObjects(curr, scanner)
        } else if (isMatched(curr, 2, 'THUMBNAILIMAGE')) {
          curr = scanner.next()
          dxf.thumbnailImage = parseThumbnailImage(curr, scanner, this._options.thumbnailImageFormat)
        }
      }
      curr = scanner.next()
    }
    return dxf
  }
}
