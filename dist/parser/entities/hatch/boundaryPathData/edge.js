"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeBoundaryPathDataSnippets = exports.SplineEdgeSnippets = exports.EllipseEdgeSnippets = exports.CircularEdgeSnippets = exports.LineEdgeSnippets = void 0;
const consts_1 = require("../../../../consts");
const parsePoint_1 = require("../../../shared/parsePoint");
const parserGenerator_1 = require("../../../shared/parserGenerator");
const shared_1 = require("./shared");
exports.LineEdgeSnippets = [
    {
        code: 11,
        name: 'end',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'start',
        parser: parserGenerator_1.PointParser,
    },
];
exports.CircularEdgeSnippets = [
    {
        code: 73,
        name: 'isCCW',
        parser: parserGenerator_1.ToBoolean,
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
        code: 40,
        name: 'radius',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'center',
        parser: parserGenerator_1.PointParser,
    },
];
exports.EllipseEdgeSnippets = [
    {
        code: 73,
        name: 'isCCW',
        parser: parserGenerator_1.ToBoolean,
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
        code: 40,
        name: 'lengthOfMinorAxis',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 11,
        name: 'end',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'center',
        parser: parserGenerator_1.PointParser,
    },
];
exports.SplineEdgeSnippets = [
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
        code: 11,
        name: 'fitDatum',
        isMultiple: true,
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 97,
        name: 'numberOfFitData',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'controlPoints',
        isMultiple: true,
        parser(curr, scanner) {
            const controlPoint = { ...(0, parsePoint_1.parsePoint)(scanner), weight: 1 };
            curr = scanner.next();
            if (curr.code === 42) {
                controlPoint.weight = curr.value;
            }
            else {
                scanner.rewind();
            }
            return controlPoint;
        },
    },
    {
        code: 40,
        name: 'knots',
        isMultiple: true,
        parser: parserGenerator_1.Identity,
    },
    {
        code: 96,
        name: 'numberOfControlPoints',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 95,
        name: 'numberOfKnots',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 74,
        name: 'isPeriodic',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 73,
        name: 'splineFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 94,
        name: 'degree',
        parser: parserGenerator_1.Identity,
    },
];
const EdgeSnippetMap = {
    [consts_1.BoundaryPathEdgeType.Line]: exports.LineEdgeSnippets,
    [consts_1.BoundaryPathEdgeType.Circular]: exports.CircularEdgeSnippets,
    [consts_1.BoundaryPathEdgeType.Elliptic]: exports.EllipseEdgeSnippets,
    [consts_1.BoundaryPathEdgeType.Spline]: exports.SplineEdgeSnippets,
};
exports.EdgeBoundaryPathDataSnippets = [
    ...shared_1.CommonBoundaryPathDataSnippets,
    {
        code: 72,
        name: 'edges',
        parser(curr, scanner) {
            const edge = { type: curr.value };
            const parser = (0, parserGenerator_1.createParser)(EdgeSnippetMap[edge.type]);
            if (!parser) {
                throw new Error(`Invalid edge type ${edge.type}`);
            }
            curr = scanner.next();
            parser(curr, scanner, edge);
            return edge;
        },
        isMultiple: true,
    },
    {
        code: 93,
        name: 'numberOfEdges',
        parser: parserGenerator_1.Identity,
    },
];
//# sourceMappingURL=edge.js.map