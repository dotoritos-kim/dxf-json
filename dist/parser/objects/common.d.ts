import { DXFParserSnippet } from '../shared/parserGenerator';
export declare const CommonObjectSnippets: DXFParserSnippet[];
export interface CommonDXFObject {
    ownerObjectId: string;
    ownerDictionaryIdHard: string;
    ownerDictionaryIdSoft: string;
    handle: string;
}
