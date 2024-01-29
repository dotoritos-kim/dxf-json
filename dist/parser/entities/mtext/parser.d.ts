import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { DXFParserSnippet } from '../../shared/parserGenerator';
import type { MTextEntity } from './types';
export declare const MTextEntityParserSnippets: DXFParserSnippet[];
export declare class MTextEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): MTextEntity;
}
