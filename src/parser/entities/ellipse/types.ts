import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface EllipseEntity extends CommonDxfEntity {
    type: 'ELLIPSE';
    subclassMarker: 'AcDbEllipse';
    center: Point3D;
    majorAxisEndPoint: Point3D;
    extrusionDirection: Point3D;
    axisRatio: number;
    startAngle: number; // radian
    endAngle: number; // radian
}
