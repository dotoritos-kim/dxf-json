export interface CommonDXFObject {
    ownerObjectId: string;
    ownerDictionaryIdHard: string;
    ownerDictionaryIdSoft: string;
    handle: string;
}

export interface HydratedDxfObject extends CommonDXFObject {
    ownerDictionarySoft?: HydratedDxfObject;
    ownerDictionaryHard?: HydratedDxfObject;
    ownerObject?: HydratedDxfObject;
}

export interface DxfDictionary extends HydratedDxfObject {
    entries?: Record<string, HydratedDxfObject>;
}
