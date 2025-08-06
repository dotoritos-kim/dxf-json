import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { SplineEntity } from './types';

const DefaultSplineEntity = {
    knotTolerance: 1e-6,
    controlTolerance: 1e-6,
    fitTolerance: 1e-9,
    knotValues: [],
    controlPoints: [],
    fitPoints: [],
};

const SplineEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 11,
        name: 'fitPoints',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 10,
        name: 'controlPoints',
        isMultiple: true,
        parser: PointParser,
    },
    {
        code: 41,
        name: 'weights',
        isMultiple: true,
        parser: Identity,
    },
    {
        code: 40,
        name: 'knots',
        isMultiple: true,
        parser: Identity,
    },
    {
        code: 13,
        name: 'endTangent',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'startTangent',
        parser: PointParser,
    },
    {
        code: 44,
        name: 'fitTolerance',
        parser: Identity,
    },
    {
        code: 43,
        name: 'controlTolerance',
        parser: Identity,
    },
    {
        code: 42,
        name: 'knotTolerance',
        parser: Identity,
    },
    {
        code: 74,
        name: 'numberOfFitPoints',
        parser: Identity,
    },
    {
        code: 73,
        name: 'numberOfControlPoints',
        parser: Identity,
    },
    {
        code: 72,
        name: 'numberOfKnots',
        parser: Identity,
    },
    {
        code: 71,
        name: 'degree',
        parser: Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: Identity,
    },
    {
        code: 210,
        name: 'normal',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class SplineEntityParser {
    static ForEntityName = 'SPLINE';
    private parser = createParser(
        SplineEntityParserSnippets,
        DefaultSplineEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as SplineEntity;
    }
}
