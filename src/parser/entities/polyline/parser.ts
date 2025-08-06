import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import { isMatched } from '../../shared';
import {
    Abort,
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { VertexParser } from '../vertex';

const DefaultPolylineEntity = {
    thickness: 0,
    flag: 0,
    startWidth: 0,
    endWidth: 0,
    meshMVertexCount: 0,
    meshNVertexCount: 0,
    surfaceMDensity: 0,
    surfaceNDensity: 0,
    smoothType: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
    vertices: [],
};

const PolylineParserSnippets: DXFParserSnippet[] = [
    {
        code: 0,
        name: 'vertices',
        isMultiple: true,
        parser(curr, scanner) {
            // Polyline 정의부 이후 바로 다음에 이것들이 나옴
            if (!isMatched(curr, 0, 'VERTEX')) {
                return Abort;
            }
            curr = scanner.next();
            return new VertexParser().parseEntity(scanner, curr);
        },
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 75,
        name: 'smoothType',
        parser: Identity,
    },
    {
        code: 74,
        name: 'surfaceNDensity',
        parser: Identity,
    },
    {
        code: 73,
        name: 'surfaceMDensity',
        parser: Identity,
    },
    {
        code: 72,
        name: 'meshNVertexCount',
        parser: Identity,
    },
    {
        code: 71,
        name: 'meshMVertexCount',
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
        code: 70,
        name: 'flag',
        parser: Identity,
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: 30,
        name: 'elevation',
        parser: Identity,
    },
    {
        code: 20, // dummy point, always 0
    },
    {
        code: 10, // dummy point, always 0
    },
    {
        code: 66, // obsolete, ignore
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class PolylineParser {
    static ForEntityName = 'POLYLINE';
    private parser = createParser(
        PolylineParserSnippets,
        DefaultPolylineEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity;
    }
}
