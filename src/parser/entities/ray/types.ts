import { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface RayEntity extends CommonDxfEntity {
    type: 'RAY';
    subclassMarker: 'AcDbRay';
    firstPoint: Point3D;
    unitDirection: Point3D;
}
