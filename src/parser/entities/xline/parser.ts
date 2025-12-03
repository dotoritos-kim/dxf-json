import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator.ts';
import { CommonEntitySnippets } from '../shared.ts'
import type { XLineEntity } from './types.ts'

const XLineEntityParserSnippets: DXFParserSnippet[] = [
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

export class XLineEntityParser {
    static ForEntityName = 'XLINE';
    private parser = createParser(XLineEntityParserSnippets);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as XLineEntity;
    }
}