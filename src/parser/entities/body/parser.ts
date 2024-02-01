import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { Body } from './types';

const DefaultBodyEntity = {
    type: 'Body',
    subclassMarker: 'AcDbModelerGeometry',
    modelerFormatVersion: 1,
};


const BodyEntityParserSnippets: DXFParserSnippet[] = [
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
    ...CommonEntitySnippets,
];

export class BodyEntityParser {
    static ForEntityName = 'Body';
    private parser = createParser(BodyEntityParserSnippets, DefaultBodyEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as Body;
    }
}
