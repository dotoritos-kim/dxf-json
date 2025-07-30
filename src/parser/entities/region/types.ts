import type { CommonDxfEntity } from '../shared';

export interface RegionEntity extends CommonDxfEntity {
    type: 'REGION';
    subclassMarker: 'AcDbModelerGeometry';
    /** Modeler format version number (currently = 1) */
    formatVersion: number;
    /** Proprietary data */
    data: string;
}