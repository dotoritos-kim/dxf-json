import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { Solid3D } from './types';

const DefaultSolid3DEntity = {
    type: 'Solid3D',
    subclassMarker: 'AcDb3dSolid',
    modelerFormatVersion: 1,
};


const Solid3DEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    {
        code: 70,
        name: 'modelerFormatVersion',
        parser: Identity,
    },
    {
        code: 1,
        name: 'proprietarData',
        parser: Identity,
    },
    {
        code: 3,
        name: 'AdditionalLines',
        parser: Identity,
    },
    {
        code: 350,
        name: "historyObjectHandle",
        parser: Identity
    },
    ...CommonEntitySnippets,
];

export class Solid3DEntityParser {
    static ForEntityName = 'Facd3D';
    private parser = createParser(Solid3DEntityParserSnippets, DefaultSolid3DEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as Solid3D;
    }
}
