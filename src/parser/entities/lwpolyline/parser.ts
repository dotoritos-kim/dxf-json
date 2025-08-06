import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { LWPolylineEntity } from './types';

const DefaultLWPolylineEntity = {
    flag: 0,
    elevation: 0,
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
    vertices: [],
};

const DefaultLWPolylineVertex = {
    bulge: 0,
};

const LWPolylineVertexSnippets: DXFParserSnippet[] = [
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
        code: 91,
        name: 'id',
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
];

const LWPolylineSnippets: DXFParserSnippet[] = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'vertices',
        isMultiple: true,
        parser(curr, scanner) {
            const entity = {} as any;
            createParser(LWPolylineVertexSnippets, DefaultLWPolylineVertex)(
                curr,
                scanner,
                entity,
            );
            return entity;
        },
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: 38,
        name: 'elevation',
        parser: Identity,
    },
    {
        code: 43,
        name: 'constantWidth',
        parser: Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: Identity,
    },
    {
        code: 90,
        name: 'numberOfVertices',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class LWPolylineParser {
    static ForEntityName = 'LWPOLYLINE';

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        createParser(LWPolylineSnippets, DefaultLWPolylineEntity)(
            curr,
            scanner,
            entity,
        );
        return entity as LWPolylineEntity;
    }
}
