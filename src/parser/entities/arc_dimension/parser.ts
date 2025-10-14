import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import { CommonEntitySnippets } from '../shared';
import { type DXFParserSnippet, Identity, PointParser, ToBoolean, createParser } from '../../shared/parserGenerator';
import { DimStyleVariablesSchema } from '../../tables/dimStyle';
import { CommonDimensionSnippets } from '../dimension';
import type { ArcDimensionEntity } from './types';

export const ArcDimensionEntitySnippet: DXFParserSnippet[] = [
  // It's reported to have this code by LibreDWG documentation and it's usage is not known.
  // Though after adding 73 code on ARC_DIMENSION, AutoCAD 2025 crashed immediately.
  // So I believe this is a misinformed one.
  {
    code: 73,
  },
  {
    code: 17,
    name: 'leaderEnd',
    parser: PointParser,
  },
  {
    code: 16,
    name: 'leaderStart',
    parser: PointParser,
  },
  {
    code: 71,
    name: 'hasLeader',
    parser: ToBoolean,
  },
  {
    code: 41,
    name: 'endAngle',
    parser: Identity,
  },
  {
    code: 40,
    name: 'startAngle',
    parser: Identity,
  },
  {
    code: 70,
    name: 'isPartial',
    parser: ToBoolean,
  },
  {
    code: 15,
    name: 'centerPoint',
    parser: PointParser,
  },
  {
    code: 14,
    name: 'xline2Point',
    parser: PointParser,
  },
  {
    code: 13,
    name: 'xline1Point',
    parser: PointParser,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
    pushContext: true,
  },
  ...DimStyleVariablesSchema.map(schema => ({ ...schema, parser: Identity })),
  ...CommonDimensionSnippets,
  ...CommonEntitySnippets
]

export class ArcDimensionParser {
  static ForEntityName = 'ARC_DIMENSION'

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): ArcDimensionEntity {
        const entity = {} as ArcDimensionEntity;
        const parser = createParser(ArcDimensionEntitySnippet)
        parser(curr, scanner, entity);
        return entity
    }
}
