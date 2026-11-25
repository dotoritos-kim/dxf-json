import { DxfParser } from '../parser/DxfParser.ts'
import type { ParsedDxf } from '../parser/types.ts'

type ErrorOptions =
  | {
      cause: Error
    }
  | undefined

/** Options for {@link DxfStreamParser} construction. */
export class DxfStreamParserOptions {
  /** Encoding label.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
   */
  encoding: string = 'utf-8'
  /** Throw `TypeError` when encountering invalid encoded data when true. When false, the decoder
   * will substitute malformed data with a replacement character.
   */
  encodingFailureFatal: boolean = false
}

export class DxfParsingError extends Error {
  readonly line: number

  constructor(msg: string, line: number, options?: ErrorOptions) {
    let _msg = `[Line ${line}]: ${msg}`
    if (options?.cause) {
      _msg += `\nCaused by ${options.cause.toString()}\n${
        (options.cause as Error).stack
      }`
    }
    super(_msg)
    this.line = line
  }
}

/**
 * Chunked front end for {@link DxfParser}.
 *
 * Chunks passed to {@link DxfStreamParser.FeedFile} are collected and, when the
 * final chunk arrives, parsed with the same code path as
 * `DxfParser.parseBuffer`. The resulting `dxf` is therefore identical to what
 * `DxfParser` returns (header, tables, blocks, entities and objects). Earlier
 * versions only filled scalar HEADER variables.
 */
export class DxfStreamParser extends EventTarget {
  public dxf: ParsedDxf = {
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

  private readonly _options: DxfStreamParserOptions
  private _chunks: Uint8Array[] = []
  private _finalChunkSeen = false

  constructor(options: DxfStreamParserOptions = new DxfStreamParserOptions()) {
    super()
    this._options = options
  }

  private Feed(input: ArrayBuffer | null, isFinalChunk = false): void {
    if (this._finalChunkSeen) {
      throw new Error('Data fed after final chunk processed')
    }
    if (input) this._chunks.push(new Uint8Array(input))
    if (isFinalChunk) {
      this._finalChunkSeen = true
      this._Finalize()
    }
  }

  private _Finalize() {
    const total = this._chunks.reduce((n, c) => n + c.byteLength, 0)
    const data = new Uint8Array(total)
    let offset = 0
    for (const c of this._chunks) {
      data.set(c, offset)
      offset += c.byteLength
    }
    this._chunks = []
    const parser = new DxfParser({
      encoding: this._options.encoding,
      encodingFailureFatal: this._options.encodingFailureFatal,
    })
    this.dxf = parser.parseBuffer(data)
  }

  async FeedFile(file: ArrayBuffer, abortSignal?: AbortSignal): Promise<void> {
    const size = file.byteLength
    if (size === 0) {
      this.Feed(null, true)
      return
    }
    const CHUNK_SIZE = 0x10000
    for (let offset = 0; offset < size; offset += CHUNK_SIZE) {
      abortSignal?.throwIfAborted()
      const chunkSize = Math.min(size - offset, CHUNK_SIZE)
      const buf = file.slice(offset, offset + chunkSize)
      this.Feed(buf, offset + chunkSize >= size)
    }
  }
}
