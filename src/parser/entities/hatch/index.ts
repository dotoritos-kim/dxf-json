import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { parseBoundaryPathData } from './boundaryPathData';
import { parsePatternData } from './patternData';
import type { HatchEntity } from './types';

const DefaultHathEntity = {
    extrusionDirection: { x: 0, y: 0, z: 1 },
    gradientRotation: 0,
    colorTint: 0,
};

const HatchSnippet: DXFParserSnippet[] = [
    {
        // Unused - String (default = LINEAR)
        code: 470,
    },
    {
        // Unused - Reserved for future use:
        code: 463,
    },
    {
        code: 462,
        name: 'colorTint',
        parser: Identity,
    },
    {
        code: 461,
        name: 'gradientDefinition',
        parser: Identity,
    },
    {
        code: 460,
        name: 'gradientRotation', // radian
        parser: Identity,
    },
    {
        code: 453,
        name: 'numberOfColors',
        parser: Identity,
    },
    {
        code: 452,
        name: 'gradientColorFlag',
        parser: Identity,
    },
    {
        // Unused - Zero is reserved for future use
        code: 451,
    },
    {
        code: 450,
        name: 'gradientFlag',
        parser: Identity,
    },
    {
        code: 10,
        name: 'seedPoints',
        parser: PointParser,
        isMultiple: true,
    },
    {
        // Unused - Number of degenerate boundary paths
        code: 99,
    },
    {
        code: 11,
        name: 'offsetVector',
        parser: PointParser,
    },
    {
        code: 98,
        name: 'numberOfSeedPoints',
        parser: Identity,
    },
    {
        code: 47,
        name: 'pixelSize',
        parser: Identity,
    },
    {
        code: 53,
        name: 'definitionLines',
        parser: parsePatternData,
        isMultiple: true,
    },
    {
        code: 78,
        name: 'numberOfDefinitionLines',
        parser: Identity,
    },
    {
        code: 77,
        name: 'isDouble',
        parser: ToBoolean,
    },
    {
        code: 73,
        name: 'isAnnotated',
        parser: ToBoolean,
    },
    {
        code: 41,
        name: 'patternScale',
        parser: Identity,
    },
    {
        code: 52,
        name: 'patternAngle',
        parser: Identity,
    },
    {
        code: 76,
        name: 'patternType',
        parser: Identity,
    },
    {
        code: 75,
        name: 'hatchStyle',
        parser: Identity,
    },
    {
        code: 92,
        name: 'boundaryPaths',
        parser: parseBoundaryPathData,
        isMultiple: true,
    },
    {
        code: 91,
        name: 'numberOfBoundaryPaths',
        parser: Identity,
    },
    {
        code: 71,
        name: 'associativity',
        parser: Identity,
    },
    {
        code: 63,
        name: 'patternFillColor',
        parser: Identity,
    },
    {
        code: 70,
        name: 'solidFill',
        parser: Identity,
    },
    {
        code: 2,
        name: 'patternName',
        parser: Identity,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'elevationPoint',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
        pushContext: true,
    },
    ...CommonEntitySnippets,
];

export class HatchEntityParser {
    static ForEntityName = 'HATCH';
    private parser = createParser(HatchSnippet, DefaultHathEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as HatchEntity;
    }
}
