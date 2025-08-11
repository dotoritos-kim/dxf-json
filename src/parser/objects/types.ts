import type { ScannerGroup } from "../DxfArrayScanner";

export interface CommonDXFObject {
    /** Similar to CommonDXFEntity['type']. They're in captial letter */
    name: string;
    /**
     * Represented by hexadecimal string
     *  
     * In DXF, every entities/objects are belongs to some others.
     * Root object is defined as '0' which doesn't actually exist.
     * */
    ownerObjectId: string;
    /** Represented by hexadecimal string, which is unique value */
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
