import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets, createLongStringSnippet } from '../shared';
import type { RegionEntity } from './types';

const RegionEntityParserSnippets: DXFParserSnippet[] = [
    ...createLongStringSnippet('data'),
    {
        code: 70,
        name: 'version',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class RegionEntityParser {
    static ForEntityName = 'REGION';
    private parser = createParser(RegionEntityParserSnippets);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as RegionEntity;
    }
}