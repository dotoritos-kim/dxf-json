import {
    createParser,
    DXFParserSnippet,
    Identity,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonTableEntryParserSnippets } from '../shared';

const LayerTableParserSnippets: DXFParserSnippet[] = [
    {
        code: 347,
        name: 'materialObjectId',
        parser: Identity,
    },
    {
        code: 390,
        name: 'plotStyleNameObjectId',
        parser: Identity,
    },
    {
        code: 370,
        name: 'lineweight',
        parser: Identity,
    },
    {
        code: 290,
        name: 'isPlotting',
        parser: ToBoolean,
    },
    {
        code: 6,
        name: 'lineType',
        parser: Identity,
    },
    {
        code: 62,
        name: 'colorIndex',
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

export const parseLayerTable = createParser(LayerTableParserSnippets);
