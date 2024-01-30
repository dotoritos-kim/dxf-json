/// <reference types="node" />
import fs from "fs";
import type { ParsedDxf } from './types';
import { Readable } from 'readable-stream';
/** Options for {@link DxfParser} construction. */
export declare class DxfParserOptions {
    /** Encoding label.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
     */
    encoding: string;
    /** Throw `TypeError` when encountering invalid encoded data when true. When false, the decoder
     * will substitute malformed data with a replacement character.
     */
    encodingFailureFatal: boolean;
}
export default class DxfParser extends EventTarget {
    private readonly _decoder;
    constructor(options?: DxfParserOptions);
    parseSync(dxfString: string): ParsedDxf;
    parseStream(stream: Readable | fs.ReadStream): Promise<ParsedDxf>;
    parseFromUrl(url: string, init?: RequestInit | undefined): Promise<ParsedDxf | null>;
    private parseAll;
}
