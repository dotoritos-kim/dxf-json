import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface XLineEntity extends CommonDxfEntity {
    type: 'XLINE';
    subclassMarker: 'AcDbXline';
    position: Point3D;
    direction: Point3D;
}