import DxfArrayScanner, { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { EllipseEntity } from './types';

const DefaultEllipseEnitty = {
    extrusionDirection: { x: 0, y: 0, z: 1 },
};

const EllipseEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 42,
        name: 'endAngle',
        parser: Identity,
    },
    {
        code: 41,
        name: 'startAngle',
        parser: Identity,
    },
    {
        code: 40,
        name: 'axisRatio',
        parser: Identity,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'majorAxisEndPoint',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'center',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class EllipseEntityParser {
    static ForEntityName = 'ELLIPSE';
    private parser = createParser(
        EllipseEntityParserSnippets,
        DefaultEllipseEnitty,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as EllipseEntity;
    }
}
