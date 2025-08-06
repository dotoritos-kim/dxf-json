import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { TextHorizontalAlign, TextVerticalAlign } from './consts';
import type { TextEntity } from './types';

export const DefaultTextEntity = {
    thickness: 0,
    rotation: 0,
    xScale: 1,
    obliqueAngle: 0,
    styleName: 'STANDARD',
    generationFlag: 0,
    halign: TextHorizontalAlign.LEFT,
    valign: TextVerticalAlign.BASELINE,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

export const TextEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 73,
        name: 'valign',
        parser: Identity,
    },
    {
        // skip for duplicated AcDbText
        code: 100,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'endPoint',
        parser: PointParser,
    },
    {
        code: 72,
        name: 'valign',
        parser: Identity,
    },
    {
        code: 72,
        name: 'halign',
        parser: Identity,
    },
    {
        code: 71,
        name: 'generationFlag',
        parser: Identity,
    },
    {
        code: 7,
        name: 'styleName',
        parser: Identity,
    },
    {
        code: 51,
        name: 'obliqueAngle',
        parser: Identity,
    },
    {
        code: 41,
        name: 'xScale',
        parser: Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: Identity,
    },
    {
        code: 1,
        name: 'text',
        parser: Identity,
    },
    {
        code: 40,
        name: 'textHeight',
        parser: Identity,
    },
    {
        code: 10,
        name: 'startPoint',
        parser: PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class TextEntityParser {
    static ForEntityName = 'TEXT';
    private parser = createParser(TextEntityParserSnippets, DefaultTextEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as TextEntity;
    }
}
