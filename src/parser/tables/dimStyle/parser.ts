import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { DimStyleVariablesSchema } from './consts';
import { CommonTableEntryParserSnippets } from '../shared';

const DimStyleTableParserSnippets: DXFParserSnippet[] = [
    ...DimStyleVariablesSchema.map((schema) => ({
        ...schema,
        parser: Identity,
    })),
    {
        code: 70,
        name: 'standardFlag',
        parser: Identity,
    },
    {
        code: 2,
        name: 'name',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    {
        code: 105,
        name: 'handle',
        parser: Identity,
    },
    ...CommonTableEntryParserSnippets.filter((snippet) => snippet.code !== 5),
];

export const parseDimStyle = createParser(DimStyleTableParserSnippets);
