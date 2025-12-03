import type { CommonDxfTableEntry } from '../types.ts'

export interface StyleTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbTextStyleTableRecord';
    name: string;
    standardFlag: number;
    fixedTextHeight: number;
    widthFactor: number;
    obliqueAngle: number;
    textGenerationFlag: number;
    lastHeight: number;
    font: string;
    bigFont: string;
    extendedFont?: string;
}
