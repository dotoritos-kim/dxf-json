"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultCircleEntity = {
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const CircleEntityParserSnippets = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 40,
        name: 'radius',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'center',
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
class CircleEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(CircleEntityParserSnippets, DefaultCircleEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.CircleEntityParser = CircleEntityParser;
CircleEntityParser.ForEntityName = 'CIRCLE';
//# sourceMappingURL=parser.js.map