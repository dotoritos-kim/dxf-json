"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultInsertEntity = {
    xScale: 1,
    yScale: 1,
    zScale: 1,
    rotation: 0,
    columnCount: 0,
    rowCount: 0,
    columnSpacing: 0,
    rowSpacing: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const InsertEntityParserSnippets = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 45,
        name: 'rowSpacing',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 44,
        name: 'columnSpacing',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'rowCount',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'columnCount',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 43,
        name: 'zScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 42,
        name: 'yScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'xScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'insertionPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 2,
        name: 'name',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 66,
        name: 'isVariableAttributes',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class InsertEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(InsertEntityParserSnippets, DefaultInsertEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.InsertEntityParser = InsertEntityParser;
InsertEntityParser.ForEntityName = 'INSERT';
//# sourceMappingURL=parser.js.map