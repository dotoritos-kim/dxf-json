"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplineEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultSplineEntity = {
    knotTolerance: 1e-6,
    controlTolerance: 1e-6,
    fitTolerance: 1e-9,
    knotValues: [],
    controlPoints: [],
    fitPoints: [],
};
const SplineEntityParserSnippets = [
    {
        code: 11,
        name: 'fitPoints',
        isMultiple: true,
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'controlPoints',
        isMultiple: true,
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 41,
        name: 'weights',
        isMultiple: true,
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'knots',
        isMultiple: true,
        parser: parserGenerator_1.Identity,
    },
    {
        code: 13,
        name: 'endTangent',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 12,
        name: 'startTangent',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 44,
        name: 'fitTolerance',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 43,
        name: 'controlTolerance',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 42,
        name: 'knotTolerance',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 74,
        name: 'numberOfFitPoints',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73,
        name: 'numberOfControlPoints',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'numberOfKnots',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'degree',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 210,
        name: 'normal',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class SplineEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(SplineEntityParserSnippets, DefaultSplineEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.SplineEntityParser = SplineEntityParser;
SplineEntityParser.ForEntityName = 'SPLINE';
//# sourceMappingURL=parser.js.map