import type { CommonDxfTableEntry } from '../types.ts'

export interface BlockRecordTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbBlockTableRecord';
    name: string;
    layoutObjects: string;
    insertionUnits: number;
    explodability: number;
    scalability: number;
    bmpPreview: string;
}
