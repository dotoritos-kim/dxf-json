import type { CommonDxfEntity } from '../shared';

export interface Body extends CommonDxfEntity {
    type: 'Body';
    subclassMarker: 'AcDbModelerGeometry';
    proprietarData: any;
    AdditionalLines: any;
    modelerFormatVersion: number;
}
