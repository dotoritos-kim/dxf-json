"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EllipseEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultEllipseEnitty = {
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const EllipseEntityParserSnippets = [
    {
        code: 42,
        name: 'endAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'startAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'axisRatio',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 11,
        name: 'majorAxisEndPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'center',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class EllipseEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(EllipseEntityParserSnippets, DefaultEllipseEnitty);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.EllipseEntityParser = EllipseEntityParser;
EllipseEntityParser.ForEntityName = 'ELLIPSE';
//# sourceMappingURL=parser.js.map