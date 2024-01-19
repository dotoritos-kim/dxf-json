import { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface PointEntity extends CommonDxfEntity {
    type: 'POINT';
    position: Point3D;
    thickness: number;
    extrusionDirection: Point3D;
    angle: number;
}
