import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonTableEntryParserSnippets } from '../shared';

const StyleTableParserSnippets: DXFParserSnippet[] = [
    {
        code: 1000,
        name: 'extendedFont',
        parser: Identity,
    },
    {
        code: 1001, // ACAD signature, skip
    },
    {
        code: 4,
        name: 'bigFont',
        parser: Identity,
    },
    {
        code: 3,
        name: 'font',
        parser: Identity,
    },
    {
        code: 42,
        name: 'lastHeight',
        parser: Identity,
    },
    {
        code: 71,
        name: 'textGenerationFlag',
        parser: Identity,
    },
    {
        code: 50,
        name: 'obliqueAngle',
        parser: Identity,
    },
    {
        code: 41,
        name: 'widthFactor',
        parser: Identity,
    },
    {
        code: 40,
        name: 'fixedTextHeight',
        parser: Identity,
    },
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
    ...CommonTableEntryParserSnippets,
];

export const parseStyleTable = createParser(StyleTableParserSnippets);
