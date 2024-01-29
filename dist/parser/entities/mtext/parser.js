"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MTextEntityParser = exports.MTextEntityParserSnippets = void 0;
const utils_1 = require("../../../utils");
const ParseHelpers_1 = require("../../ParseHelpers");
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultMTextEntity = {
    textStyle: 'STANDARD',
    extrusionDirection: { x: 0, y: 0, z: 1 },
    rotation: 0,
};
exports.MTextEntityParserSnippets = [
    {
        // 얘는 원래 순수 MTEXT에는 없으나 ATTRIB에 내장된 MTEXT에는 있다
        // 만약 ATTRIB에만 이걸 놔두면, ATTRIB를 제외했을 때 터지는 경우가 생김
        code: 46,
        name: 'annotationHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 101,
        parser(curr, scanner) {
            // 정체불명인데 기존 로직에 있어서 보존
            (0, ParseHelpers_1.skipEmbeddedObject)(scanner);
        },
    },
    {
        code: 50,
        name: 'columnHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 49,
        name: 'columnGutter',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 48,
        name: 'columnWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 79,
        name: 'columnAutoHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 78,
        name: 'columnFlowReversed',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 76,
        name: 'columnCount',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 75,
        name: 'columnType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 441,
        name: 'backgroundFillTransparency',
        parser: parserGenerator_1.Identity,
    },
    {
        // Color to use for background fill when group code 90 is 1.
        code: 63,
        name: 'backgroundFillColor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 45,
        name: 'fillBoxScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: [...(0, utils_1.generateIntegers)(430, 440)], // named color
        name: 'backgroundColor',
        parser: parserGenerator_1.Identity, // 당장은 테이블 보기 힘들어서 놔둠 추후에 rgb화 필요
    },
    {
        code: [...(0, utils_1.generateIntegers)(420, 430)], // rgb
        name: 'backgroundColor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 90,
        name: 'backgroundFill',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 44,
        name: 'lineSpacing',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73,
        name: 'lineSpacingStyle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: parserGenerator_1.Identity, // radian
    },
    {
        code: 43, // vertical height of characters, 미사용
    },
    {
        code: 42, // horizontal width of characters, 미사용
    },
    {
        code: 11,
        name: 'direction',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 7,
        name: 'styleName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 3,
        name: 'text',
        parser(curr, scanner, entity) {
            var _a;
            // Code 1에다 추가로 더 달아야 함
            return ((_a = entity.text) !== null && _a !== void 0 ? _a : '') + curr.value;
        },
    },
    {
        code: 1,
        name: 'text',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'drawingDirection',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'attachmentPoint',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'width',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'height',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'insertionPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class MTextEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(exports.MTextEntityParserSnippets, DefaultMTextEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.MTextEntityParser = MTextEntityParser;
MTextEntityParser.ForEntityName = 'MTEXT';
//# sourceMappingURL=parser.js.map