import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { CommonEntitySnippets } from '../shared';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import type { RayEntity } from './types'

const RayEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 11,
        name: 'direction',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'position',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class RayParser {
    static ForEntityName = 'RAY';
    private parser = createParser(RayEntityParserSnippets);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as RayEntity;
    }
}