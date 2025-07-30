import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { XLineEntity } from './types';

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