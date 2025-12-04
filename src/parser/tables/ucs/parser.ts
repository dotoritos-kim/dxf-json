import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonTableEntryParserSnippets } from '../shared.ts'

export const UcsTableEntryParserSnippets: DXFParserSnippet[] = [
  {
    code: 13,
    name: 'orthographicOrigin',
    parser: PointParser,
  },
  {
    code: 71,
    name: 'orthographicType',
    parser: Identity,
  },
  {
    code: 346,
    name: 'baseUcsHandle',
    parser: Identity,
  },
  {
    code: 146,
    name: 'elevation',
    parser: Identity,
  },
  {
    code: 79,
    name: 'isOrthographic',
    parser: ToBoolean,
  },
  {
    code: 12,
    name: 'yAxis',
    parser: PointParser,
  },
  {
    code: 11,
    name: 'xAxis',
    parser: PointParser,
  },
  {
    code: 10,
    name: 'origin',
    parser: PointParser,
  },
  {
    code: 70,
    name: 'flag',
    parser: Identity,
  },
  {
    code: 2,
    name: 'name',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonTableEntryParserSnippets,
]
export const parseUcsTableEntry = createParser(UcsTableEntryParserSnippets)
