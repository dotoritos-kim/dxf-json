import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { generateIntegers } from '../../../utils';
import { skipEmbeddedObject } from '../../ParseHelpers';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { MTextEntity } from './types';

const DefaultMTextEntity = {
    textStyle: 'STANDARD',
    extrusionDirection: { x: 0, y: 0, z: 1 },
    rotation: 0,
};

export const MTextEntityParserSnippets: DXFParserSnippet[] = [
    {
        // This is not in pure MTEXT but exists in MTEXT embedded in ATTRIB
        // For compatibility with ATTRIB, this was added
        code: 46,
        name: 'annotationHeight',
        parser: Identity,
    },
    {
        code: 101,
        parser(curr, scanner) {
            // Not sure what this does, it's ancient code
            skipEmbeddedObject(scanner);
        },
    },
    {
        code: 50,
        name: 'columnHeight',
        parser: Identity,
    },
    {
        code: 49,
        name: 'columnGutter',
        parser: Identity,
    },
    {
        code: 48,
        name: 'columnWidth',
        parser: Identity,
    },
    {
        code: 79,
        name: 'columnAutoHeight',
        parser: Identity,
    },
    {
        code: 78,
        name: 'columnFlowReversed',
        parser: Identity,
    },
    {
        code: 76,
        name: 'columnCount',
        parser: Identity,
    },
    {
        code: 75,
        name: 'columnType',
        parser: Identity,
    },
    {
        code: 441,
        name: 'backgroundFillTransparency',
        parser: Identity,
    },
    {
        // Color to use for background fill when group code 90 is 1.
        code: 63,
        name: 'backgroundFillColor',
        parser: Identity,
    },
    {
        code: 45,
        name: 'fillBoxScale',
        parser: Identity,
    },
    {
        code: [...generateIntegers(430, 440)], // named color
        name: 'backgroundColor',
        parser: Identity, // why this was separate from below one?
    },
    {
        code: [...generateIntegers(420, 430)], // rgb
        name: 'backgroundColor',
        parser: Identity,
    },
    {
        code: 90,
        name: 'backgroundFill',
        parser: Identity,
    },
    {
        code: 44,
        name: 'lineSpacing',
        parser: Identity,
    },
    {
        code: 73,
        name: 'lineSpacingStyle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: Identity, // radian
    },
    {
        code: 43, // vertical height of characters, this is not used in AutoCAd
    },
    {
        code: 42, // horizontal width of characters, this is not used in AutoCAd
    },
    {
        code: 11,
        name: 'direction',
        parser: PointParser,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 7,
        name: 'styleName',
        parser: Identity,
    },
    {
        code: 3,
        name: 'text',
        parser(curr, _, entity) {
            // When there are more than 255 characters, code 3 will be presented
            return (entity.text ?? '') + curr.value;
        },
    },
    {
        code: 1,
        name: 'text',
        parser(curr, _, entity) {
            // Code 3 may occur before code 1
            return curr.value + (entity.text ?? '')
        },
    },
    {
        code: 72,
        name: 'drawingDirection',
        parser: Identity,
    },
    {
        code: 71,
        name: 'attachmentPoint',
        parser: Identity,
    },
    {
        code: 41,
        name: 'width',
        parser: Identity,
    },
    {
        code: 40,
        name: 'height',
        parser: Identity,
    },
    {
        code: 10,
        name: 'insertionPoint',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class MTextEntityParser {
    static ForEntityName = 'MTEXT';
    private parser = createParser(
        MTextEntityParserSnippets,
        DefaultMTextEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as MTextEntity;
    }
}
