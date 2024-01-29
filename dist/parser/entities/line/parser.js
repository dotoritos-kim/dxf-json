"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultLineEntity = {
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const LineEntityParserSnippets = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 11,
        name: 'endPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'startPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class LineEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(LineEntityParserSnippets, DefaultLineEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.LineEntityParser = LineEntityParser;
LineEntityParser.ForEntityName = 'LINE';
//# sourceMappingURL=parser.js.map