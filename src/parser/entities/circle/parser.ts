import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { CircleEntity } from './types';

const DefaultCircleEntity = {
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

const CircleEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 40,
        name: 'radius',
        parser: Identity,
    },
    {
        code: 10,
        name: 'center',
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

export class CircleEntityParser {
    static ForEntityName = 'CIRCLE';
    private parser = createParser(
        CircleEntityParserSnippets,
        DefaultCircleEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as CircleEntity;
    }
}
