import { DXFParserSnippet } from '../shared/parserGenerator';
import type { CommonDXFObject } from './common';
export declare const DictionarySnippets: DXFParserSnippet[];
export declare enum RecordCloneFlag {
    NOT_APPLICABLE = 0,
    KEEP_EXISTING = 1,
    USE_CLONE = 2,
    XREF_VALUE_NAME = 3,
    VALUE_NAME = 4,
    UNMANGLE_NAME = 5
}
export interface DictionaryDXFObject extends CommonDXFObject {
    subclassMarker: 'AcDbDictionary';
    isHardOwned?: boolean;
    recordCloneFlag: RecordCloneFlag;
    entries: {
        name: string;
        objectId?: string;
    }[];
}
