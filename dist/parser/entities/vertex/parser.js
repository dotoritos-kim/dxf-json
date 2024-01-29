"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexParser = void 0;
const utils_1 = require("../../../utils");
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultVertexEntity = {
    startWidth: 0,
    endWidth: 0,
    bulge: 0,
};
const VertextParserSnippets = [
    {
        code: 91,
        name: 'id',
        parser: parserGenerator_1.Identity,
    },
    {
        code: [...(0, utils_1.generateIntegers)(71, 75)],
        name: 'faces',
        isMultiple: true, // isMultiple이 참이면 code가 달라도 동일한 곳에 넣어줌
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'tangentDirection',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 42,
        name: 'bulge',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'endWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'startWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 30,
        name: 'z',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 20,
        name: 'y',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'x',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100, // skip for AcDbVertex
    },
    ...shared_1.CommonEntitySnippets,
];
class VertexParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(VertextParserSnippets, DefaultVertexEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.VertexParser = VertexParser;
VertexParser.ForEntityName = 'VERTEX';
//# sourceMappingURL=parser.js.map