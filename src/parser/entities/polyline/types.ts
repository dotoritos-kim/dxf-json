import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
import type { VertexEntity } from '../vertex/types';
import type { SmoothType } from './consts';

export interface PolylineEntity extends CommonDxfEntity {
    type: 'POLYLINE';
    subclassMarker: 'AcDb2dPolyline | AcDb3dPolyline';
    thickness: number;
    flag: number;
    startWidth: number;
    endWidth: number;
    meshMVertexCount: number;
    meshNVertexCount: number;
    surfaceMDensity: number;
    surfaceNDensity: number;
    smoothType: SmoothType;
    extrusionDirection: Point3D;
    vertices: VertexEntity[];
}
