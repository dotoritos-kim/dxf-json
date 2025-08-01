import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

// todo: check what the hack is Subdivision
export interface MeshEntity extends CommonDxfEntity {
    type: 'MESH';
    subclassMarker: 'AcDbSubDMesh';
    version: number;
    /** Blend Crease property (true if is turn on) */
    isBlendCreased: boolean;
    subdivisionLevel: number;
    /** Vertex count of level 0 */
    verticesCount: number;
    vertices: Point3D[]
    /** Size of flattened face indices. It's different to faceIndices.length */
    totalFaceIndices: number;
    faceIndices: number[][];
    edgeCount: number
    edgeIndices: [number, number][];
    edgeCreaseCount: number
    edgeCreaseWeights: number[]
    /** Count of sub-entity which property has been overridden */
    overridenSubEntityCount: number
    // I think sub-entity marker and overrideCount might be multiple
    // but not sure, so I didn't put them here. If you find such
    // case please report to github issue.
}