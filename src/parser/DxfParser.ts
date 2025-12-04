import { DxfArrayScanner } from './DxfArrayScanner.ts'
import { parseHeader } from './header/parser.ts'
import { parseTables } from './tables/parser.ts'
import { parseBlocks } from './blocks/parser.ts'
import { parseEntities } from './entities/parser.ts'
import { parseObjects } from './objects/parser.ts'
import { parseThumbnailImage } from './thumbnailImage/parser.ts'
import { isMatched } from './shared/isMatched.ts'
import type { ParsedDxf } from './types.ts'
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
  private readonly _decoder: TextDecoder
  private readonly _options: DxfParserOptions

  constructor(options: Partial<DxfParserOptions> = {}) {
    super()
    const defaults = new DxfParserOptions()
    this._options = Object.assign(defaults, options)
    this._decoder = new TextDecoder(this._options.encoding, {
      fatal: this._options.encodingFailureFatal,
    })
  }
  parseSync(dxfString: string, isDebugMode = false): ParsedDxf {
    const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g)
    const scanner = new DxfArrayScanner(dxfLinesArray, isDebugMode)
    if (!scanner.hasNext()) {
      throw Error('Empty file')
    }

    return this.parseAll(scanner)
  }
  parseStream(stream: Readable) {
    let dxfString = ''
    const self = this
    return new Promise<ParsedDxf>((res, rej) => {
      stream.on('data', (chunk) => {
        dxfString += chunk
      })
      stream.on('end', () => {
        try {
          const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g)
          const scanner = new DxfArrayScanner(dxfLinesArray)
          if (!scanner.hasNext()) {
            throw Error('Empty file')
          }
          res(self.parseAll(scanner))
        } catch (err) {
          rej(err)
        }
      })
      stream.on('error', (err) => {
        rej(err)
      })
    })
  }

  async parseFromUrl(url: string, init?: RequestInit | undefined) {
    const response = await fetch(url, init)

    if (!response.body) return null

    const reader = response.body.getReader()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        buffer += this._decoder.decode(new ArrayBuffer(0), { stream: false })
        break
      }
      buffer += this._decoder.decode(value, { stream: true })
    }
    return this.parseSync(buffer)
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
