import {
  parseGroupValue,
  type ScannerGroup,
} from "../parser/DxfArrayScanner";
import { isMatched } from "../parser/shared";
import type { ParsedDxf } from "../parser/types";
import { parsePoint } from "./streamShared/parseData";

type ErrorOptions =
  | {
      cause: Error;
    }
  | undefined;

/** Options for {@link DxfStreamParser} construction. */
export class DxfStreamParserOptions {
  /** Encoding label.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
   */
  encoding: string = "utf-8";
  /** Throw `TypeError` when encountering invalid encoded data when true. When false, the decoder
   * will substitute malformed data with a replacement character.
   */
  encodingFailureFatal: boolean = false;
}

export class DxfParsingError extends Error {
  readonly line: number;

  constructor(msg: string, line: number, options?: ErrorOptions) {
    let _msg = `[Line ${line}]: ${msg}`;
    if (options?.cause) {
      _msg += `\nCaused by ${options.cause.toString()}\n${
        (options.cause as Error).stack
      }`;
    }
    super(_msg);
    this.line = line;
  }
}

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
  };

  private readonly _decoder: TextDecoder;
  private readonly _pointParser: parsePoint;

  constructor(options: DxfStreamParserOptions = new DxfStreamParserOptions()) {
    super();
    this._decoder = new TextDecoder(options.encoding, {
      fatal: options.encodingFailureFatal,
    });
    this._pointParser = new parsePoint();
  }

  private _finalChunkSeen: boolean = false;
  private _curChunk: string = "";
  private _curGroupCode: number | null = null;
  private _curLineNum = 1;

  private _eof = false;
  private _curValue: ScannerGroup = { code: 0, value: 0 };
  private _curSection: string = "";
  private _currVarName: string = "";

  private Feed(input: ArrayBuffer | null, isFinalChunk = false): void {
    const s = this._decoder.decode(input ?? undefined, {
      stream: !isFinalChunk,
    });
    this.FeedString(s, isFinalChunk);
  }

  /** Feed next string chunk to the parser. */
  private FeedString(input: string, isFinalChunk = false): void {
    if (this._finalChunkSeen) {
      throw new Error("Data fed after final chunk processed");
    }
    if (isFinalChunk) {
      this._finalChunkSeen = true;
    }
    this._curChunk += input;
    this._ProcessCurChunk();
    if (isFinalChunk) {
      this._Finalize();
    }
  }
  private _Finalize() {}

  async FeedFile(file: ArrayBuffer, abortSignal?: AbortSignal): Promise<void> {
    const size = file.byteLength;
    const CHUNK_SIZE = 0x10000;
    for (let offset = 0; offset < size; offset += CHUNK_SIZE) {
      abortSignal?.throwIfAborted();
      const chunkSize = Math.min(size - offset, CHUNK_SIZE);
      const buf = await file.slice(offset, offset + chunkSize);
      this.Feed(buf, offset + chunkSize >= size);
    }
  }

  private _ProcessCurChunk(): void {
    for (const s of this._ConsumeCurChunkLines()) {
      this._ProcessLine(s);
      this._curLineNum++;
      if (!this._eof) {
        switch (this._curSection) {
          case "HEADER":
            let headerValue = this._curValue.value;
            if (this._curValue.code === 9) {
              this._currVarName = headerValue;
            } else if (this._curValue.code === 10) {
              this._pointParser.parseStart(this._curValue);
            } else if (
              this._pointParser.startCode === this._curValue.code ||
              this._pointParser.startCode + 10 === this._curValue.code ||
              this._pointParser.startCode + 20 === this._curValue.code
            ) {
              headerValue = this._pointParser.setPoint(this._curValue);
            } else {
              if (this._currVarName)
                this.dxf.header[this._currVarName] = headerValue;
            }
            break;
          case "BLOCKS":
            break;
          case "ENTITIES":
            break;
          case "TABLES":
            break;
          case "OBJECTS":
            break;
        }
      }
    }
  }

  private *_ConsumeCurChunkLines(): IterableIterator<string> {
    let pos = 0;
    const n = this._curChunk.length;
    while (pos < n) {
      let sepPos = this._curChunk.indexOf("\r", pos);
      let nextPos = 0;
      if (sepPos >= 0) {
        nextPos = sepPos + 1;
        if (nextPos < n && this._curChunk.charAt(nextPos) == "\n") {
          nextPos++;
        }
      } else {
        sepPos = this._curChunk.indexOf("\n", pos);
        if (sepPos >= 0) {
          nextPos = sepPos + 1;
        }
      }
      if (sepPos < 0) {
        break;
      }
      yield this._curChunk.substring(pos, sepPos);
      pos = nextPos;
    }
    if (pos != 0) {
      this._curChunk = this._curChunk.substring(pos);
    }
  }
  private _ProcessLine(line: string): void {
    if (this._curGroupCode === null) {
      const codeStr = line.trim();
      this._curGroupCode = parseInt(codeStr);
      if (isNaN(this._curGroupCode)) {
        this._Error("Bad group code: " + codeStr);
      }
      return;
    }
    const token = new Token(this._curGroupCode, line);

    if (!isMatched(token, 0, "EOF")) {
      switch (token.value) {
        case "SECTION":
          this._curSection = "SECTION";
          break;
        case "HEADER":
          this._curSection = "HEADER";
          break;
        case "BLOCKS":
          this._curSection = "BLOCKS";
          break;
        case "ENTITIES":
          this._curSection = "ENTITIES";
          break;
        case "TABLES":
          this._curSection = "TABLES";
          break;
        case "OBJECTS":
          this._curSection = "OBJECTS";
          break;
      }
      this._eof = false;
    }
    if (isMatched(token, 0, "EOF")) {
      this._eof = true;
    }
    this._curValue = token;
    this._curGroupCode = null;
  }
  private _Error(msg: string, cause: any | null = null) {
    let options = undefined;
    if (cause) {
      options = { cause };
    }
    throw new DxfParsingError(msg, this._curLineNum, options);
  }
}

class Token {
  readonly code: number;
  readonly value: string | number | boolean;

  constructor(code: number, valueStr: string) {
    this.code = code;
    this.value = parseGroupValue(code, valueStr);
  }
}
