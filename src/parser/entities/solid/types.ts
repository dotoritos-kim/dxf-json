import { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface SolidEntity extends CommonDxfEntity {
    type: 'SOLID';
    subclassMarker: 'AcDbTrace';
    points: Point3D[];
    thickness: number;
    extrusionDirection: Point3D;
}
