import type { CommonDXFObject } from "../types";
import type { RecordCloneFlag } from "../consts";

export interface DictionaryDXFObject extends CommonDXFObject {
    subclassMarker: 'AcDbDictionary';
    isHardOwned?: boolean;
    recordCloneFlag: RecordCloneFlag;
    entries: { name: string; objectSoftId?: string; objectHardId?: string }[];
}
