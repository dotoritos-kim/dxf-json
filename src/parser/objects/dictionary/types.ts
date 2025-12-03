import type { CommonDXFObject } from '../types.ts';
import type { RecordCloneFlag } from '../consts.ts';

export interface DictionaryDXFObject extends CommonDXFObject {
    subclassMarker: 'AcDbDictionary';
    isHardOwned?: boolean;
    recordCloneFlag: RecordCloneFlag;
    entries: { name: string; objectSoftId?: string; objectHardId?: string }[];
}
