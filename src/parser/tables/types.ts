export type * from './blockRecord'
export type * from './dimStyle'
export type * from './layer'
export type * from './ltype'
export type * from './style'
export type * from './vport'

export interface DxfTable<T extends CommonDxfTableEntry> {
    subclassMarker: 'AcDbSymbolTable';
    name: string;
    handle: string;
    ownerDictionaryIds?: string[];
    ownerObjectId: string;
    maxNumberOfEntries: number;
    entries: T[];
}

export interface CommonDxfTableEntry {
    name: string;
    handle: string;
    ownerObjectId: string;
}
