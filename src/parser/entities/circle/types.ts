import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface CircleEntity extends CommonDxfEntity {
    type: 'CIRCLE';
    subclassMarker: 'AcDbCircle';
    thickness: number;
    center: Point3D;
    radius: number;
    extrusionDirection: Point3D;
}
