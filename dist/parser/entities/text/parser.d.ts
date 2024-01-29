import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { DXFParserSnippet } from '../../shared/parserGenerator';
import { TextHorizontalAlign, TextVerticalAlign } from './consts';
import { TextEntity } from './types';
export declare const DefaultTextEntity: {
    thickness: number;
    rotation: number;
    xScale: number;
    obliqueAngle: number;
    styleName: string;
    generationFlag: number;
    halign: TextHorizontalAlign;
    valign: TextVerticalAlign;
    extrusionDirection: {
        x: number;
        y: number;
        z: number;
    };
};
export declare const TextEntityParserSnippets: DXFParserSnippet[];
export declare class TextEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): TextEntity;
}
