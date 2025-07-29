import { generateIntegers } from '../../../utils';
import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { VertexEntity } from './types';

const DefaultVertexEntity = {
    startWidth: 0,
    endWidth: 0,
    bulge: 0,
};

const VertextParserSnippets: DXFParserSnippet[] = [
    {
        code: 91,
        name: 'id',
        parser: Identity,
    },
    {
        code: [...generateIntegers(71, 75)],
        name: 'faces',
        isMultiple: true, // isMultiple이 참이면 code가 달라도 동일한 곳에 넣어줌
        parser: Identity,
    },
    {
        code: 50,
        name: 'tangentDirection',
        parser: Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: Identity,
    },
    {
        code: 42,
        name: 'bulge',
        parser: Identity,
    },
    {
        code: 41,
        name: 'endWidth',
        parser: Identity,
    },
    {
        code: 40,
        name: 'startWidth',
        parser: Identity,
    },
    {
        code: 30,
        name: 'z',
        parser: Identity,
    },
    {
        code: 20,
        name: 'y',
        parser: Identity,
    },
    {
        code: 10,
        name: 'x',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    {
        code: 100, // skip for AcDbVertex
    },
    ...CommonEntitySnippets,
];

export class VertexParser {
    static ForEntityName = 'VERTEX';
    private parser = createParser(VertextParserSnippets, DefaultVertexEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as VertexEntity;
    }
}
