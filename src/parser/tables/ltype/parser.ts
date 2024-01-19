import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonTableEntryParserSnippets } from '../shared';
import type { LineTypeElement } from './types';

const LTypeElementParserSnippets: DXFParserSnippet[] = [
    {
        code: 9,
        name: 'text',
        parser: Identity,
    },
    {
        code: 45,
        name: 'offsetY',
        parser: Identity,
    },
    {
        code: 44,
        name: 'offsetX',
        parser: Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: Identity,
    },
    {
        code: 46,
        name: 'scale',
        parser: Identity,
    },
    {
        code: 340,
        name: 'styleObjectId',
        parser: Identity,
    },
    {
        code: 75,
        name: 'shapeNumber',
        parser: Identity,
    },
    {
        code: 74,
        name: 'elementTypeFlag',
        parser: Identity,
    },
    {
        code: 49,
        name: 'elementLength',
        parser: Identity,
    },
];

const parseLTypeElement = createParser(LTypeElementParserSnippets, {
    elementTypeFlag: 0,
    elementLength: 0,
});

const LTypeTableParserSnippets: DXFParserSnippet[] = [
    {
        code: 49,
        name: 'pattern',
        parser(curr, scanner) {
            const entity = {} as LineTypeElement;
            parseLTypeElement(curr, scanner, entity);
            return entity;
        },
        isMultiple: true,
    },
    {
        code: 40,
        name: 'totalPatternLength',
        parser: Identity,
    },
    {
        code: 73,
        name: 'numberOfLineTypes',
        parser: Identity,
    },
    {
        code: 72,
        parser: Identity, // 항상 의미없는 값(A)이라 버림
    },
    {
        code: 3,
        name: 'description',
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

export const parseLTypeTable = createParser(LTypeTableParserSnippets);
