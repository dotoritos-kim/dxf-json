export interface DxfObject {
    name: string;
    handle: string;
    ownerDictionaryIdSoft: string;
    ownerDictionaryIdHard?: string;
    ownerObjectId?: string;
}

export interface HydratedDxfObject extends DxfObject {
    ownerDictionarySoft?: HydratedDxfObject;
    ownerDictionaryHard?: HydratedDxfObject;
    ownerObject?: HydratedDxfObject;
}

export interface DxfDictionary extends HydratedDxfObject {
    entries?: Record<string, HydratedDxfObject>;
}
