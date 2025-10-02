import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { ViewportEntity } from './types';

const ViewportParserSnippets: DXFParserSnippet[] = [
    {
        code: [335, 343, 344, 91],
        name: 'softPointers',
        isMultiple: true,
        parser: Identity,
    },
    {
        code: 361,
        name: 'sunId',
        parser: Identity,
    },
    {
        code: 431,
        name: 'ambientLightColorName',
        parser: Identity,
    },
    {
        code: 421,
        name: 'ambientLightColorInstance',
        parser: Identity,
    },
    {
        code: 63,
        name: 'ambientLightColorIndex',
        parser: Identity,
    },
    {
        code: 142,
        name: 'contrast',
        parser: Identity,
    },
    {
        code: 141,
        name: 'brightness',
        parser: Identity,
    },
    {
        code: 282,
        name: 'defaultLightingType',
        parser: Identity,
    },
    {
        code: 292,
        name: 'isDefaultLighting',
        parser: ToBoolean
    },
    {
        code: 348,
        name: 'visualStyleId',
        parser: Identity,
    },
    {
        code: 333,
        name: 'shadePlotId',
        parser: Identity,
    },
    {
        code: 332,
        name: 'backgroundId',
        parser: Identity,
    },
    {
        code: 61,
        name: 'majorGridFrequency',
        parser: Identity,
    },
    {
        code: 170,
        name: 'shadePlotMode',
        parser: Identity,
    },
    {
        code: 146,
        name: 'elevation',
        parser: Identity,
    },
    {
        code: 79,
        name: 'orthographicType',
        parser: Identity,
    },
    {
        code: 346,
        name: 'ucsBaseId',
        parser: Identity,
    },
    {
        code: 345,
        name: 'ucsId',
        parser: Identity,
    },
    {
        code: 112,
        name: 'ucsYAxis',
        parser: PointParser,
    },
    {
        code: 111,
        name: 'ucsXAxis',
        parser: PointParser,
    },
    {
        code: 110,
        name: 'ucsOrigin',
        parser: PointParser,
    },
    {
        code: 74,
        name: 'iconFlag',
        parser: Identity,
    },
    {
        code: 71,
        name: 'ucsPerViewport',
        parser: Identity,
    },
    {
        code: 281,
        name: 'renderMode',
        parser: Identity,
    },
    {
        code: 1,
        name: 'sheetName',
        parser: Identity,
    },
    {
        code: 340,
        name: 'clippingBoundaryId',
        parser: Identity,
    },
    {
        code: 90,
        name: 'statusBitFlags',
        parser: Identity,
    },
    {
        code: 331,
        name: 'frozenLayerIds',
        isMultiple: true,
        parser: Identity,
    },
    {
        code: 72,
        name: 'circleZoomPercent',
        parser: Identity,
    },
    {
        code: 51,
        name: 'viewTwistAngle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'snapAngle',
        parser: Identity,
    },
    {
        code: 45,
        name: 'viewHeight',
        parser: Identity,
    },
    {
        code: 44,
        name: 'backClipZ',
        parser: Identity,
    },
    {
        code: 43,
        name: 'frontClipZ',
        parser: Identity,
    },
    {
        code: 42,
        name: 'perspectiveLensLength',
        parser: Identity,
    },
    {
        code: 17,
        name: 'targetPoint',
        parser: PointParser,
    },
    {
        code: 16,
        name: 'viewDirection',
        parser: PointParser,
    },
    {
        code: 15,
        name: 'gridSpacing',
        parser: PointParser,
    },
    {
        code: 14,
        name: 'snapSpacing',
        parser: PointParser,
    },
    {
        code: 13,
        name: 'snapBase',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'displayCenter',
        parser: PointParser,
    },
    {
        code: 69,
        name: 'viewportId',
        parser: Identity,
    },
    {
        code: 68,
        name: 'status',
        parser: Identity,
    },
    {
        code: 41,
        name: 'height',
        parser: Identity,
    },
    {
        code: 40,
        name: 'width',
        parser: Identity,
    },
    {
        code: 10,
        name: 'viewportCenter',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
        pushContext: true,
    },
    ...CommonEntitySnippets,
]

export class ViewportParser {
    static ForEntityName = 'VIEWPORT';

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): ViewportEntity {
        const entity = {} as ViewportEntity;
        const parser = createParser(ViewportParserSnippets);
        parser(curr, scanner, entity);
        return entity;
    }
}