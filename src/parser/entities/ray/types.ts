import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface RayEntity extends CommonDxfEntity {
    type: 'RAY';
    subclassMarker: 'AcDbRay';
    /** Start point (in WCS) */
    position: Point3D;
    /** Unit direction vector (in WCS) */
    direction: Point3D;
}