import type { ScannerGroup } from '../../DxfArrayScanner';
import type DxfArrayScanner from '../../DxfArrayScanner';
import { DXFParserSnippet } from '../parserGenerator';
import type { XData } from './types';
export declare const XDataParserSnippets: DXFParserSnippet[];
export declare function parseXData(curr: ScannerGroup, scanner: DxfArrayScanner): XData;
