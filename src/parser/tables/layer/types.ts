import type { ColorIndex } from '../../../types';
import type { CommonDxfTableEntry } from '../types';

export interface LayerTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbLayerTableRecord';
    name: string;
    standardFlag: number;
    colorIndex: ColorIndex;
    lineType: string;
    isPlotting: boolean;
    lineweight: number;
    plotStyleNameObjectId?: string;
    materialObjectId?: string;
}
