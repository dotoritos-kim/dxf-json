import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonTableEntryParserSnippets } from '../shared';

const BlockRecordTableParserSnippets: DXFParserSnippet[] = [
    {
        code: 310,
        name: 'bmpPreview',
        parser: Identity,
    },
    {
        code: 281,
        name: 'scalability',
        parser: Identity,
    },
    {
        code: 280,
        name: 'explodability',
        parser: Identity,
    },
    {
        code: 70,
        name: 'insertionUnits',
        parser: Identity,
    },
    {
        code: 340,
        name: 'layoutObjects',
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
    ...CommonTableEntryParserSnippets,
];

export const parseBlockRecordTable = createParser(
    BlockRecordTableParserSnippets,
);
