import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets, createLongStringSnippet } from '../shared';
import type { Solid3DEntity } from './types';

const SolidEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 350,
        name: 'historyObjectSoftId',
        parser: Identity,
    },
    {
        code: 100, // AcDb3dSolid
        name: 'subclassMarker',
        parser: Identity,
    },
    ...createLongStringSnippet('data'),
    {
        code: 70,
        name: 'version',
        parser: Identity,
    },
    {
        code: 100, // AcDbModelerGeometry
    },
    ...CommonEntitySnippets,
];

export class Solid3DEntityParser {
    static ForEntityName = '3DSOLID';
    private parser = createParser(SolidEntityParserSnippets);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as Solid3DEntity;
    }
}