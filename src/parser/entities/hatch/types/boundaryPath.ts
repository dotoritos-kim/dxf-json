import type { BoundaryPathEdgeType } from '../../../../consts/hatch';
import type { Point2D } from '../../../../types';

interface BoundaryPathBase {
    boundaryPathTypeFlag: number; // bit combination of BoundaryPathTypeFlag
    numberOfSourceBoundaryObjects: number;
    sourceBoundaryObjects: string[];
}

export interface PolylineBoundaryPath extends BoundaryPathBase {
    hasBulge: boolean;
    isClosed: boolean;
    numberOfVertices: number;
    vertices: (Point2D & {
        bulge: number;
    })[];
}

export interface EdgeBoundaryPath<EdgeType extends BoundaryPathEdge>
    extends BoundaryPathBase {
    numberOfEdges: number;
    edges: EdgeType[];
}

interface BoundaryPathEdgeCommon {
    type: BoundaryPathEdgeType;
}

export type BoundaryPath =
    | PolylineBoundaryPath
    | EdgeBoundaryPath<BoundaryPathEdge>;

export interface LineEdge extends BoundaryPathEdgeCommon {
    start: Point2D;
    end: Point2D;
}

export interface ArcEdge extends BoundaryPathEdgeCommon {
    center: Point2D;
    radius: number;
    startAngle: number;
    endAngle: number;
    isCCW?: boolean;
}

export interface EllipseEdge extends BoundaryPathEdgeCommon {
    center: Point2D;
    // end point of major axis relative to center
    end: Point2D;
    lengthOfMinorAxis: number;
    startAngle: number;
    endAngle: number;
    isCCW?: boolean;
}

export interface SplineEdge extends BoundaryPathEdgeCommon {
    degree: number;
    splineFlag: number;
    isPeriodic?: boolean;
    numberOfKnots: number;
    numberOfControlPoints: number;
    knots: number[];
    controlPoints: (Point2D & {
        weight?: number; // default = 1
    })[];
    numberOfFitData: number;
    fitDatum: Point2D[];
    startTangent: Point2D;
    endTangent: Point2D;
}

export type BoundaryPathEdge = LineEdge | ArcEdge | EllipseEdge | SplineEdge;
