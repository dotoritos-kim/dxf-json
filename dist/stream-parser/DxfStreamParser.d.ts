import { ParsedDxf } from 'parser/types';
type ErrorOptions = {
    cause: Error;
} | undefined;
/** Options for {@link DxfStreamParser} construction. */
export declare class DxfStreamParserOptions {
    /** Encoding label.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
     */
    encoding: string;
    /** Throw `TypeError` when encountering invalid encoded data when true. When false, the decoder
     * will substitute malformed data with a replacement character.
     */
    encodingFailureFatal: boolean;
}
export declare class DxfParsingError extends Error {
    readonly line: number;
    constructor(msg: string, line: number, options?: ErrorOptions);
}
export default class DxfStreamParser extends EventTarget {
    dxf: ParsedDxf;
    private readonly _decoder;
    private readonly _pointParser;
    constructor(options?: DxfStreamParserOptions);
    private _finalChunkSeen;
    private _curChunk;
    private _curGroupCode;
    private _curLineNum;
    private _eof;
    private _curValue;
    private _curSection;
    private _currVarName;
    private Feed;
    /** Feed next string chunk to the parser. */
    private FeedString;
    private _Finalize;
    FeedFile(file: ArrayBuffer, abortSignal?: AbortSignal): Promise<void>;
    private _ProcessCurChunk;
    private _ConsumeCurChunkLines;
    private _ProcessLine;
    private _Error;
}
export {};
