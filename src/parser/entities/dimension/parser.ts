import { DimStyleVariablesSchema } from '../../tables/dimStyle';
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import { Abort, DXFParser, DXFParserSnippet, Identity, PointParser, createParser } from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { DimensionEntity } from './types';

export const AlignedDimensionSnippets: DXFParserSnippet[] = [
    {
        code: 100, // Skip possible AcDbRotatedDimension
    },
    {
        code: 52,
        name: 'obliqueAngle',
        parser: Identity,
    },
    {
        code: 50,
        name: 'rotationAngle',
        parser: Identity,
    },
    {
        code: 14,
        name: 'subDefinitionPoint2',
        parser: PointParser,
    },
    {
        code: 13,
        name: 'subDefinitionPoint1',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'insertionPoint',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    }
]

export const AngularDimensionSnippets: DXFParserSnippet[] = [
    {
        code: 16,
        name: 'arcPoint',
        parser: PointParser,
    },
    {
        code: 15,
        name: 'centerPoint',
        parser: PointParser,
    },
    {
        code: 14,
        name: 'subDefinitionPoint2',
        parser: PointParser,
    },
    {
        code: 13,
        name: 'subDefinitionPoint1',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    }
]

export const OrdinateDimensionSnippets: DXFParserSnippet[] = [
    {
        code: 14,
        name: 'subDefinitionPoint2',
        parser: PointParser,
    },
    {
        code: 13,
        name: 'subDefinitionPoint1',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    }
]

export const RadialDimensionSnippets: DXFParserSnippet[] = [
    {
        code: 40,
        name: 'leaderLength',
        parser: Identity,
    },
    {
        code: 15,
        name: 'subDefinitionPoint',
        parser: PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    }
]

function getSnippetForType(subclassMarker: string): DXFParser | null {
    switch (subclassMarker) {
        case 'AcDbAlignedDimension':
            return createParser(AlignedDimensionSnippets)
        case 'AcDb3PointAngularDimension':
        case 'AcDb2LineAngularDimension':
            return createParser(AngularDimensionSnippets)
        case 'AcDbOrdinateDimension':
            return createParser(OrdinateDimensionSnippets)
        case 'AcDbRadialDimension':
        case 'AcDbDiametricDimension':
            return createParser(RadialDimensionSnippets)
    }
    return null
}

export const DimensionSnippets: DXFParserSnippet[] = [
    {
        code: 100,
        parser(curr, scanner, entity) {
            const subclassMarker = curr.value
            const parser = getSnippetForType(subclassMarker)

            if (!parser) {
                return Abort
            }
            parser(curr, scanner, entity)
        },
        pushContext: true // since code 40 collides at leaderLength and DIMSCALE, we have to separate context
    },
    // DIMSTYLE overrides may occur infront of specific dimension type
    ...DimStyleVariablesSchema.map(schema => ({ ...schema, parser: Identity })),
    {
        code: 3,
        name: 'styleName',
        parser: Identity,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 51,
        name: 'ocsRotation',
        parser: Identity,
    },
    {
        code: 53,
        name: 'textRotation',
        parser: Identity,
    },
    {
        code: 1,
        name: 'text',
        parser: Identity,
    },
    {
        code: 42,
        name: 'measurement',
        parser: Identity,
    },
    {
        code: 72,
        name: 'textLineSpacingStyle',
        parser: Identity,
    },
    {
        code: 71,
        name: 'attachmentPoint',
        parser: Identity,
    },
    {
        code: 70,
        name: 'dimensionType',
        parser: Identity,
    },
    {
        code: 11,
        name: 'textPoint',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'definitionPoint',
        parser: PointParser,
    },
    {
        code: 2,
        name: 'name',
        parser: Identity,
    },
    {
        code: 280,
        name: 'version',
        parser: Identity,
    },
    {
        code: 100, // Skip AcDbDimension
    },
    ...CommonEntitySnippets
]

export class DimensionParser {
    static ForEntityName = 'DIMENSION';

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): DimensionEntity {
        const entity = {} as DimensionEntity;
        const parser = createParser(DimensionSnippets)
        parser(curr, scanner, entity);
        return entity
    }
}
