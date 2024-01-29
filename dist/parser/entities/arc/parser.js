"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultArcEntity = {
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const ArcEntityParserSnippets = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 51,
        name: 'endAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'startAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
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
        // skip for AcDbCircle
        code: 100,
    },
    ...shared_1.CommonEntitySnippets,
];
class ArcEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(ArcEntityParserSnippets, DefaultArcEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.ArcEntityParser = ArcEntityParser;
ArcEntityParser.ForEntityName = 'ARC';
//# sourceMappingURL=parser.js.map