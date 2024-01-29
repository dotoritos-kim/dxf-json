import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
export interface ArcEntity extends CommonDxfEntity {
    type: 'ARC';
    subclassMarker: 'AcDbArc';
    thickness: number;
    center: Point3D;
    radius: number;
    startAngle: number;
    endAngle: number;
    extrusionDirection: Point3D;
}
