import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
export interface SplineEntity extends CommonDxfEntity {
    type: 'SPLINE';
    subclassMarker: 'AcDbSpline';
    normal?: Point3D;
    flag: number;
    degree: number;
    numberOfKnots: number;
    numberOfControlPoints: number;
    numberOfFitPoints: number;
    knotTolerance: number;
    controlTolerance: number;
    fitTolerance: number;
    startTangent?: Point3D;
    endTangent?: Point3D;
    knots: number[];
    weights?: number[];
    controlPoints: Point3D[];
    fitPoints: number[];
}
