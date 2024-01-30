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
