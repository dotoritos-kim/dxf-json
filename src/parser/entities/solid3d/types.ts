import type { CommonDxfEntity } from '../shared';

export interface Solid3DEntity extends CommonDxfEntity {
    type: '3DSOLID';
    subclassMarker: 'AcDb3dSolid';
    /** Modeler format version number (currently = 1) */
    version: number;
    /** Proprietary data */
    data: string;
    /** Soft-owner ID/handle to history object */
    historyObjectSoftId: string;
}