import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { LineEntity } from './types';

const DefaultLineEntity = {
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

const LineEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'endPoint',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'startPoint',
        parser: PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class LineEntityParser {
    static ForEntityName = 'LINE';
    private parser = createParser(LineEntityParserSnippets, DefaultLineEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as LineEntity;
    }
}
