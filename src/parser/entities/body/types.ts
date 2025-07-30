import type { CommonDxfEntity } from '../shared';

export interface BodyEntity extends CommonDxfEntity {
    type: 'BODY';
    subclassMarker: 'AcDbModelerGeometry';
    /** Modeler format version number (currently = 1) */
    version: number;
    /** Proprietary data */
    data: string;
}