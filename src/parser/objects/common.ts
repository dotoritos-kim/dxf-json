import { DXFParserSnippet, Identity } from '../shared/parserGenerator';

export const CommonObjectSnippets: DXFParserSnippet[] = [
    {
        code: 330,
        name: 'ownerObjectId',
        parser: Identity,
    },
    {
        code: 102,
        // end of ACAD_XDICTIONARY
    },
    {
        code: 360,
        name: 'ownerDictionaryIdHard',
        parser: Identity,
    },
    {
        code: 102,
        // start of ACAD_XDICTIONARY
    },
    {
        code: 102,
        // end of ACAD_REACTOR
    },
    {
        code: 330,
        name: 'ownerDictionaryIdSoft',
        parser: Identity,
    },
    {
        code: 102,
        // start of ACAD_REACTOR
    },
    {
        code: 102,
        // end of application defined
    },
    {
        code: 102,
        // start of application defined
    },
    {
        code: 5,
        name: 'handle',
        parser: Identity,
    },
];

export interface CommonDXFObject {
    ownerObjectId: string;
    ownerDictionaryIdHard: string;
    ownerDictionaryIdSoft: string;
    handle: string;
}
