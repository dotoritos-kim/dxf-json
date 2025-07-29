import type { Point3D } from '@src/types'; 
import type { CommonDxfEntity } from '../shared';

export interface FaceEntity extends CommonDxfEntity {
    subclassMarker: 'AcDbFace';
    vertices: Point3D[];
    shape: number;
}
