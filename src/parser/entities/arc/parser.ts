import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';

const DefaultArcEntity = {
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

const ArcEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 51,
        name: 'endAngle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'startAngle',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
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
        // skip for AcDbCircle
        code: 100,
    },
    ...CommonEntitySnippets,
];

export class ArcEntityParser {
    static ForEntityName = 'ARC';
    private parser = createParser(ArcEntityParserSnippets, DefaultArcEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity;
    }
}
