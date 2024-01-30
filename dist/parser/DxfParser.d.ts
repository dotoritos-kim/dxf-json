/// <reference types="node" />
import fs from "fs";
import DxfArrayScanner from './DxfArrayScanner';
import type { ParsedDxf } from './types';
import { Readable } from 'readable-stream';
export default class DxfParser {
    parseSync(dxfString: string): ParsedDxf;
    parseStream(stream: Readable | fs.ReadStream): Promise<ParsedDxf>;
    parseFromUrl(url: string, encoding?: string, init?: RequestInit | undefined): Promise<ParsedDxf | null>;
    parseAll(scanner: DxfArrayScanner): ParsedDxf;
}
