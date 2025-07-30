import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { CommonEntitySnippets } from '../shared';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import type { ImageEntity } from './types'

const DefaultImageEntity = {
    brightness: 50,
    contrast: 50,
    fade: 0,
    clippingBoundaryPath: []
};

const ImageEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 290,
        name: 'clipMode',
        parser: Identity,
    },
    {
        code: 14,
        name: 'clippingBoundaryPath',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 91,
        name: 'countBoundaryPoints',
        parser: Identity,
    },
    {
        code: 71,
        name: 'clippingBoundaryType',
        parser: Identity,
    },
    {
        code: 360,
        name: 'imageDefReactorHandle',
        parser: Identity,
    },
    {
        code: 283,
        name: 'fade',
        parser: Identity,
    },
    {
        code: 282,
        name: 'contrast',
        parser: Identity,
    },
    {
        code: 281,
        name: 'brightness',
        parser: Identity,
    },
    {
        code: 280,
        name: 'isClipped',
        parser: ToBoolean,
    },
    {
        code: 70,
        name: 'flags',
        parser: Identity,
    },
    {
        code: 340,
        name: 'imageDefHandle',
        parser: Identity,
    },
    {
        code: 13,
        name: 'imageSize',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'vPixel',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'uPixel',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'position',
        parser: PointParser,
    },
    {
        code: 90,
        name: 'version',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class ImageEntityParser {
    static ForEntityName = 'IMAGE';
    private parser = createParser(
        ImageEntityParserSnippets,
        DefaultImageEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as ImageEntity;
    }
}