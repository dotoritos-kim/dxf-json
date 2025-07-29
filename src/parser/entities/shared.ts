import type { ScannerGroup } from '@src/parser/DxfArrayScanner';
import { parseExtensions } from '@src/parser/shared/extensions/parser';
import type { ColorIndex, ColorInstance } from '@src/types';
import { getAcadColor } from '../getAcadColor';
import {
    DXFParserSnippet,
    Identity,
    ToBoolean,
} from '../shared/parserGenerator';
import { XData, XDataParserSnippets } from '../shared/xdata';

export interface CommonDxfEntity {
    type: string;
    handle: string;
    ownerBlockRecordSoftId?: string;
    isInPaperSpace?: boolean;
    layer: string;
    lineType?: string;
    materialObjectHardId?: string;
    colorIndex?: ColorIndex;
    lineweight?: number; // 문서에는 무조건 있다고 하는데, 실제로는 없는 경우 많음
    lineTypeScale?: number; // default = 1
    isVisible?: boolean;
    proxyByte?: number;
    proxyEntity?: string;
    color?: ColorInstance;
    colorName?: string;
    transparency?: number;
    plotStyleHardId?: string;
    shadowMode?: ShadowMode;
    xdata?: XData;
    /** 
     * Application specific extension by their application-name. 
     * As it differs by application, you have to parse by your own.
     * Note that group codes 102 for brackets are not included in the array.
     * */
    extensions?: Record<string, ScannerGroup[]>
}

export enum ShadowMode {
    CAST_AND_RECEIVE = 0,
    CAST = 1,
    RECEIVE = 2,
    IGNORE = 3,
}

// 이게 top에 와야함. 우선순위가 더 높다.
export const CommonEntitySnippets: DXFParserSnippet[] = [
    ...XDataParserSnippets,
    {
        code: 284,
        name: 'shadowMode',
        parser: Identity,
    },
    {
        code: 390,
        name: 'plotStyleHardId',
        parser: Identity,
    },
    {
        code: 440,
        name: 'transparency',
        parser: Identity,
    },
    {
        code: 430,
        name: 'colorName',
        parser: Identity,
    },
    {
        code: 420,
        name: 'color',
        parser: Identity,
    },
    {
        code: 310,
        name: 'proxyEntity',
        parser: Identity,
    },
    {
        code: 92,
        name: 'proxyByte',
        parser: Identity,
    },
    {
        code: 60,
        name: 'isVisible',
        parser: ToBoolean,
    },
    {
        code: 48,
        name: 'lineTypeScale',
        parser: Identity,
    },
    {
        code: 370,
        name: 'lineweight',
        parser: Identity,
    },
    {
        code: 62,
        name: 'colorIndex',
        parser(curr, _, entity) {
            const colorIndex = curr.value;
            entity.color = getAcadColor(Math.abs(colorIndex));
            return colorIndex;
        },
    },
    {
        code: 347,
        name: 'materialObjectHardId',
        parser: Identity,
    },
    {
        code: 6,
        name: 'lineType',
        parser: Identity,
    },
    {
        code: 8,
        name: 'layer',
        parser: Identity,
    },
    {
        code: 410,
        name: 'layoutTabName',
        parser: Identity,
    },
    {
        code: 67,
        name: 'isInPaperSpace',
        parser: ToBoolean,
    },
    {
        code: 100, // AcDbEntity를 소모시키기 위함
    },
    {
        code: 330,
        name: 'ownerBlockRecordSoftId',
        parser: Identity,
    },
    {
        code: 102, // {ACAD_XDICTIONARY
        parser: parseExtensions,
    },
    {
        code: 102, // {ACAD_REACTORS
        parser: parseExtensions,
    },
    {
        code: 102, // {application_name
        parser: parseExtensions,
    },
    {
        code: 5,
        name: 'handle',
        parser: Identity,
    },
];
