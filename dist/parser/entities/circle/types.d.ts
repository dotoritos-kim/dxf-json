import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
export interface CircleEntity extends CommonDxfEntity {
    type: 'CIRCLE';
    subclassMarker: 'AcDbCircle';
    thickness: number;
    center: Point3D;
    radius: number;
    extrusionDirection: Point3D;
}
