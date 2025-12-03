import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator.ts';
import { CommonEntitySnippets, createLongStringSnippet } from '../shared.ts'
import type { RegionEntity } from './types.ts'

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