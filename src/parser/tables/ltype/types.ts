import type { CommonDxfTableEntry } from '../types';

export interface LTypeTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbLinetypeTableRecord';
    name: string;
    standardFlag: number;
    description: string;
    numberOfLineTypes: number;
    totalPatternLength: number;
    pattern?: LineTypeElement[];
}

export interface LineTypeElement {
    elementLength: number;
    elementTypeFlag: number;
    shapeNumber?: number;
    styleObjectId?: string;
    scale?: number;
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    text?: string;
}
