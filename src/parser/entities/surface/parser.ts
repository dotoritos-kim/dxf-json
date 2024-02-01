import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { Surface } from './types';

const DefaultSurfaceEntity = {
    type: 'Surface',
    subclassMarker: 'AcDbSurface',
    modelerFormatVersion: 1,
};


const SurfaceEntityParserSnippets: DXFParserSnippet[] = [
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
        code: 71,
        name: 'UIsolines',
        parser: Identity,
    },
    {
        code: 72,
        name: 'VIsolines',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class SurfaceEntityParser {
    static ForEntityName = 'Surface';
    private parser = createParser(SurfaceEntityParserSnippets, DefaultSurfaceEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as Surface;
    }
}
