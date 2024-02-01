import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { Face3D } from './types';
const DefaultFace3DEntity = {
    type: 'face3D',
    subclassMarker: 'AcDbFace',
    invisibleEdgeFlag: 0,
};

const Face3DEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    {
        code: 10,
        name: 'firstCorner',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'secondCorner',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'thirdCorner',
        parser: PointParser,
    },
    {
        code: 13,
        name: 'fourthCorner',
        parser: PointParser,
    },
    {
        code: 70,
        name: 'invisibleEdgeFlag',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class Face3DEntityParser {
    static ForEntityName = 'Facd3D';
    private parser = createParser(Face3DEntityParserSnippets, DefaultFace3DEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as Face3D;
    }
}
