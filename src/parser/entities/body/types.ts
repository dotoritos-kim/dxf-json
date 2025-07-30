import type { CommonDxfEntity } from '../shared';

export interface BodyEntity extends CommonDxfEntity {
    type: 'BODY';
    subclassMarker: 'AcDbModelerGeometry';
    /** Modeler format version number (currently = 1) */
    formatVersion: number;
    /** Proprietary data */
    data: string;
}