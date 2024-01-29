"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLTypeTable = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const LTypeElementParserSnippets = [
    {
        code: 9,
        name: 'text',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 45,
        name: 'offsetY',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 44,
        name: 'offsetX',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 46,
        name: 'scale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 340,
        name: 'styleObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 75,
        name: 'shapeNumber',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 74,
        name: 'elementTypeFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 49,
        name: 'elementLength',
        parser: parserGenerator_1.Identity,
    },
];
const parseLTypeElement = (0, parserGenerator_1.createParser)(LTypeElementParserSnippets, {
    elementTypeFlag: 0,
    elementLength: 0,
});
const LTypeTableParserSnippets = [
    {
        code: 49,
        name: 'pattern',
        parser(curr, scanner) {
            const entity = {};
            parseLTypeElement(curr, scanner, entity);
            return entity;
        },
        isMultiple: true,
    },
    {
        code: 40,
        name: 'totalPatternLength',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73,
        name: 'numberOfLineTypes',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        parser: parserGenerator_1.Identity, // 항상 의미없는 값(A)이라 버림
    },
    {
        code: 3,
        name: 'description',
        parser: parserGenerator_1.Identity,
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
exports.parseLTypeTable = (0, parserGenerator_1.createParser)(LTypeTableParserSnippets);
//# sourceMappingURL=parser.js.map