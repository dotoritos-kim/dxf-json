import { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface XlineEntity extends CommonDxfEntity {
    type: 'XLINE';
    subclassMarker: 'AcDbXline';
    firstPoint: Point3D;
    unitDirection: Point3D;
}
