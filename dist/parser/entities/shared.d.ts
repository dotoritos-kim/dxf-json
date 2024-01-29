import type { ColorIndex, ColorInstance } from '../../types';
import DxfArrayScanner, { ScannerGroup } from '../DxfArrayScanner';
import { DXFParserSnippet } from '../shared/parserGenerator';
import { XData } from '../shared/xdata';
export interface CommonDxfEntity {
    type: string;
    handle: string;
    ownerBlockRecordSoftId?: string;
    isInPaperSpace?: boolean;
    layer: string;
    lineType?: string;
    materialObjectHardId?: string;
    colorIndex?: ColorIndex;
    lineweight?: number;
    lineTypeScale?: number;
    isVisible?: boolean;
    proxyByte?: number;
    proxyEntity?: string;
    color?: ColorInstance;
    colorName?: string;
    transparency?: number;
    plotStyleHardId?: string;
    shadowMode?: ShadowMode;
    xdata?: XData;
    ownerdictionaryHardId?: string | number | boolean;
    ownerDictionarySoftId?: string | number | boolean;
}
export declare enum ShadowMode {
    CAST_AND_RECEIVE = 0,
    CAST = 1,
    RECEIVE = 2,
    IGNORE = 3
}
export declare const CommonEntitySnippets: DXFParserSnippet[];
export declare function skipApplicationGroups(curr: ScannerGroup, scanner: DxfArrayScanner): void;
