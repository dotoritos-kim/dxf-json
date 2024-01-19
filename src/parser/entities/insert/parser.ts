import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { InsertEntity } from './types';

const DefaultInsertEntity = {
    xScale: 1,
    yScale: 1,
    zScale: 1,
    rotation: 0,
    columnCount: 0,
    rowCount: 0,
    columnSpacing: 0,
    rowSpacing: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

const InsertEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 45,
        name: 'rowSpacing',
        parser: Identity,
    },
    {
        code: 44,
        name: 'columnSpacing',
        parser: Identity,
    },
    {
        code: 71,
        name: 'rowCount',
        parser: Identity,
    },
    {
        code: 70,
        name: 'columnCount',
        parser: Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: Identity,
    },
    {
        code: 43,
        name: 'zScale',
        parser: Identity,
    },
    {
        code: 42,
        name: 'yScale',
        parser: Identity,
    },
    {
        code: 41,
        name: 'xScale',
        parser: Identity,
    },
    {
        code: 10,
        name: 'insertionPoint',
        parser: PointParser,
    },
    {
        code: 2,
        name: 'name',
        parser: Identity,
    },
    {
        code: 66,
        name: 'isVariableAttributes',
        parser: ToBoolean,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class InsertEntityParser {
    static ForEntityName = 'INSERT';
    private parser = createParser(
        InsertEntityParserSnippets,
        DefaultInsertEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as InsertEntity;
    }
}
