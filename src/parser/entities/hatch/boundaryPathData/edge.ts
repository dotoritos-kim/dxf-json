import { BoundaryPathEdgeType } from '../../../../consts';
import { parsePoint } from '../../../shared/parsePoint';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../../shared/parserGenerator';
import { CommonBoundaryPathDataSnippets } from './shared';

export const LineEdgeSnippets: DXFParserSnippet[] = [
    {
        code: 11,
        name: 'end',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'start',
        parser: PointParser,
    },
];

export const CircularEdgeSnippets: DXFParserSnippet[] = [
    {
        code: 73,
        name: 'isCCW',
        parser: ToBoolean,
    },
    {
        code: 51,
        name: 'endAngle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'startAngle',
        parser: Identity,
    },
    {
        code: 40,
        name: 'radius',
        parser: Identity,
    },
    {
        code: 10,
        name: 'center',
        parser: PointParser,
    },
];

export const EllipseEdgeSnippets: DXFParserSnippet[] = [
    {
        code: 73,
        name: 'isCCW',
        parser: ToBoolean,
    },
    {
        code: 51,
        name: 'endAngle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'startAngle',
        parser: Identity,
    },
    {
        code: 40,
        name: 'lengthOfMinorAxis',
        parser: Identity,
    },
    {
        code: 11,
        name: 'end',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'center',
        parser: PointParser,
    },
];

export const SplineEdgeSnippets: DXFParserSnippet[] = [
    {
        code: 13,
        name: 'endTangent',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'startTangent',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'fitDatum',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 97,
        name: 'numberOfFitData',
        parser: Identity,
    },
    {
        code: 10,
        name: 'controlPoints',
        isMultiple: true,
        parser(curr, scanner) {
            const controlPoint = { ...parsePoint(scanner), weight: 1 };
            curr = scanner.next();

            if (curr.code === 42) {
                controlPoint.weight = curr.value;
            } else {
                scanner.rewind();
            }

            return controlPoint;
        },
    },
    {
        code: 40,
        name: 'knots',
        isMultiple: true,
        parser: Identity,
    },
    {
        code: 96,
        name: 'numberOfControlPoints',
        parser: Identity,
    },
    {
        code: 95,
        name: 'numberOfKnots',
        parser: Identity,
    },
    {
        code: 74,
        name: 'isPeriodic',
        parser: ToBoolean,
    },
    {
        code: 73,
        name: 'splineFlag',
        parser: Identity,
    },
    {
        code: 94,
        name: 'degree',
        parser: Identity,
    },
];

const EdgeSnippetMap = {
    [BoundaryPathEdgeType.Line]: LineEdgeSnippets,
    [BoundaryPathEdgeType.Circular]: CircularEdgeSnippets,
    [BoundaryPathEdgeType.Elliptic]: EllipseEdgeSnippets,
    [BoundaryPathEdgeType.Spline]: SplineEdgeSnippets,
};

export const EdgeBoundaryPathDataSnippets: DXFParserSnippet[] = [
    ...CommonBoundaryPathDataSnippets,
    {
        code: 72,
        name: 'edges',
        parser(curr, scanner) {
            const edge = { type: curr.value };
            const parser = createParser(
                EdgeSnippetMap[edge.type as BoundaryPathEdgeType],
            );

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
        parser: Identity,
    },
];
