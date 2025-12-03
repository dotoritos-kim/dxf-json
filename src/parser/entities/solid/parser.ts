import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { generateIntegers } from '../../../utlis.ts'
import { CommonEntitySnippets } from '../shared.ts'
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator.ts';
import type { SolidEntity } from './types.ts'

const DefaultSolidEntity = {
    points: [],
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

const SolidEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: [...generateIntegers(10, 14)],
        name: 'points',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class SolidEntityParser {
    static ForEntityName = 'SOLID';
    private parser = createParser(
        SolidEntityParserSnippets,
        DefaultSolidEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as SolidEntity;
    }
}
