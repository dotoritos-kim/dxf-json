import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonTableEntryParserSnippets } from '../shared';

const VPortTableParserSnippets: DXFParserSnippet[] = [
    {
        code: [63, 421, 431],
        name: 'ambientColor',
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
        name: 'isDefaultLightingOn',
        parser: ToBoolean,
    },
    {
        code: 348,
        name: 'visualStyleObjectId',
        parser: Identity,
    },
    {
        code: 333,
        name: 'shadePlotObjectId',
        parser: Identity,
    },
    {
        code: 332,
        name: 'backgroundObjectId',
        parser: Identity,
    },
    {
        code: 61,
        name: 'majorGridLines',
        parser: Identity,
    },
    {
        code: 170,
        name: 'shadePlotSetting',
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
        name: 'ucsIconSetting',
        parser: Identity,
    },
    {
        code: 71,
        name: 'viewMode',
        parser: Identity,
    },
    {
        code: 281,
        name: 'renderMode',
        parser: Identity,
    },
    {
        code: 1,
        name: 'styleSheet',
        parser: Identity,
    },
    {
        code: [331, 441],
        name: 'frozenLayers',
        parser: Identity,
        isMultiple: true,
    },
    {
        code: 72,
        name: 'circleSides',
        parser: Identity,
    },
    {
        code: 51,
        name: 'viewTwistAngle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'snapRotationAngle',
        parser: Identity,
    },
    {
        code: 45,
        name: 'viewHeight',
        parser: Identity,
    },
    {
        code: 44,
        name: 'backClippingPlane',
        parser: Identity,
    },
    {
        code: 43,
        name: 'frontClippingPlane',
        parser: Identity,
    },
    {
        code: 42,
        name: 'lensLength',
        parser: Identity,
    },
    {
        code: 17,
        name: 'viewTarget',
        parser: PointParser,
    },
    {
        code: 16,
        name: 'viewDirectionFromTarget',
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
        name: 'snapBasePoint',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'center',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'upperRightCorner',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'lowerLeftCorner',
        parser: PointParser,
    },
    {
        code: 70,
        name: 'standardFlag',
        parser: Identity,
    },
    {
        code: 2,
        name: 'name',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonTableEntryParserSnippets,
];

export const parseVPortTable = createParser(VPortTableParserSnippets);
