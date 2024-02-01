import type { CommonDxfEntity } from '../shared';

export interface Surface extends CommonDxfEntity {
    type: 'Surface';
    subclassMarker: 'AcDbSurface';
    proprietarData: any;
    AdditionalLines: any;
    modelerFormatVersion: number;
    UIsolines: number;
    VIsolines: number;
}
