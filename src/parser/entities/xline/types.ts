import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface XLineEntity extends CommonDxfEntity {
    type: 'XLINE';
    subclassMarker: 'AcDbXline';
    position: Point3D;
    direction: Point3D;
}