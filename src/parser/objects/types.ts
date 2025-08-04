import type { ScannerGroup } from "../DxfArrayScanner";

export interface CommonDXFObject {
    ownerObjectId: string;    
    handle: string;
    /** 
     * Application specific extension by their application-name. 
     * As it differs by application, you have to parse by your own.
     * Note that group codes 102 for brackets are not included in the array.
     * */
    extensions?: Record<string, ScannerGroup[]>
}

export interface HydratedDxfObject extends CommonDXFObject {
    ownerDictionarySoft?: HydratedDxfObject;
    ownerDictionaryHard?: HydratedDxfObject;
    ownerObject?: HydratedDxfObject;
}

export interface DxfDictionary extends HydratedDxfObject {
    entries?: Record<string, HydratedDxfObject>;
}
