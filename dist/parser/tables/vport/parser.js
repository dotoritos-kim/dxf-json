"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVPortTable = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const VPortTableParserSnippets = [
    {
        code: [63, 421, 431],
        name: 'ambientColor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 142,
        name: 'contrast',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 141,
        name: 'brightness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 282,
        name: 'defaultLightingType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 292,
        name: 'isDefaultLightingOn',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 348,
        name: 'visualStyleObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 333,
        name: 'shadePlotObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 332,
        name: 'backgroundObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 61,
        name: 'majorGridLines',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 170,
        name: 'shadePlotSetting',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 146,
        name: 'elevation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 79,
        name: 'orthographicType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 112,
        name: 'ucsYAxis',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 111,
        name: 'ucsXAxis',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 110,
        name: 'ucsOrigin',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 74,
        name: 'ucsIconSetting',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'viewMode',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 281,
        name: 'renderMode',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 1,
        name: 'styleSheet',
        parser: parserGenerator_1.Identity,
    },
    {
        code: [331, 441],
        name: 'frozenLayers',
        parser: parserGenerator_1.Identity,
        isMultiple: true,
    },
    {
        code: 72,
        name: 'circleSides',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 51,
        name: 'viewTwistAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'snapRotationAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 45,
        name: 'viewHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 44,
        name: 'backClippingPlane',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 43,
        name: 'frontClippingPlane',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 42,
        name: 'lensLength',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 17,
        name: 'viewTarget',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 16,
        name: 'viewDirectionFromTarget',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 15,
        name: 'gridSpacing',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 14,
        name: 'snapSpacing',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 13,
        name: 'snapBasePoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 12,
        name: 'center',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 11,
        name: 'upperRightCorner',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'lowerLeftCorner',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 70,
        name: 'standardFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 2,
        name: 'name',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonTableEntryParserSnippets,
];
exports.parseVPortTable = (0, parserGenerator_1.createParser)(VPortTableParserSnippets);
//# sourceMappingURL=parser.js.map