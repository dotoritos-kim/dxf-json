import type { Point3D } from '../../..'; 
import type { CommonDxfEntity } from '../shared';

export interface FaceEntity extends CommonDxfEntity {
    subclassMarker: 'AcDbFace';
    vertices: Point3D[];
    shape: number;
}
