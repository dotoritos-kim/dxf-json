import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface Face3D extends CommonDxfEntity {
    type: 'Face3D';
    subclassMarker: 'AcDbFace';
    firstCorner: Point3D;
    secondCorner: Point3D;
    thirdCorner: Point3D;
    fourthCorner: Point3D;
    invisibleEdgeFlag: number;
}
