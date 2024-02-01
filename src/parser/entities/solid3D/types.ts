import type { CommonDxfEntity } from '../shared';

export interface Solid3D extends CommonDxfEntity {
    type: 'Solid3D';
    subclassMarker: 'AcDb3dSolid';
    proprietarData: any;
    AdditionalLines: any;
    modelerFormatVersion: number;
    historyObjectHandle: string;
}
