"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultPointEntity = {
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
    angle: 0,
};
const PointEntityParserSnippets = [
    // Angle of the X axis for the UCS in effect
    // when the point was drawn.
    // used when PDMODE is nonzero.
    {
        code: 50,
        name: 'angle',
        parser: parserGenerator_1.Identity,
    },
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
        code: 10,
        name: 'position',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class PointEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(PointEntityParserSnippets, DefaultPointEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.PointEntityParser = PointEntityParser;
PointEntityParser.ForEntityName = 'POINT';
//# sourceMappingURL=parser.js.map