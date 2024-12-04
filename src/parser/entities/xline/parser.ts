import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { CommonEntitySnippets } from '../shared';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import type { XlineEntity } from './types';

const DefaultXlineEntity = {
    firstPoint: { x: 0, y: 0, z: 1 },
    extrusionDirection: { x: 0, y: 0, z: 1 }
};

const XlineEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 10,
        name: 'firstPoint',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'unitDirection',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class XlineEntityParser {
    static ForEntityName = 'XLINE';
    private parser = createParser(
        XlineEntityParserSnippets,
        DefaultXlineEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as XlineEntity;
    }
}
