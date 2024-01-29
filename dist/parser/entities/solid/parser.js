"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidEntityParser = void 0;
const utils_1 = require("../../../utils");
const shared_1 = require("../shared");
const parserGenerator_1 = require("../../shared/parserGenerator");
const DefaultSolidEntity = {
    points: [],
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const SolidEntityParserSnippets = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: [...(0, utils_1.generateIntegers)(10, 14)],
        name: 'points',
        isMultiple: true,
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class SolidEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(SolidEntityParserSnippets, DefaultSolidEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.SolidEntityParser = SolidEntityParser;
SolidEntityParser.ForEntityName = 'SOLID';
//# sourceMappingURL=parser.js.map