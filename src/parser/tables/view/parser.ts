import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonTableEntryParserSnippets } from '../shared.ts'

export const ViewTableParserSnippets: DXFParserSnippet[] = [
  {
    code: 346,
    name: 'baseUcsId',
    parser: Identity,
  },
  {
    code: 345,
    name: 'ucsId',
    parser: Identity,
  },
  {
    code: 146,
    name: 'elevation',
    parser: Identity,
  },
  {
    code: 79,
    name: 'orthographicType',
    parser: Identity,
  },
  {
    code: 112,
    name: 'ucsYAxis',
    parser: PointParser,
  },
  {
    code: 111,
    name: 'ucsXAxis',
    parser: PointParser,
  },
  {
    code: 110,
    name: 'ucsOrigin',
    parser: PointParser,
  },
  {
    code: 361,
    name: 'sunHardId',
    parser: Identity,
  },
  {
    code: 348,
    name: 'styleHardId',
    parser: Identity,
  },
  {
    code: 334,
    name: 'liveSectionSoftId',
    parser: Identity,
  },
  {
    code: 332,
    name: 'backgroundSoftId',
    parser: Identity,
  },
  {
    code: 73,
    name: 'isPlottable',
    parser: ToBoolean,
  },
  {
    code: 72,
    name: 'isUcsAssociated',
    parser: ToBoolean,
  },
  {
    code: 281,
    name: 'renderMode',
    parser: Identity,
  },
  {
    code: 71,
    name: 'viewMode',
    parser: Identity,
  },
  {
    code: 50,
    name: 'twistAngle',
    parser: Identity,
  },
  {
    code: 44,
    name: 'backClippingPlane',
    parser: Identity,
  },
  {
    code: 43,
    name: 'frontClippingPlane',
    parser: Identity,
  },
  {
    code: 42,
    name: 'lensLength',
    parser: Identity,
  },
  {
    code: 12,
    name: 'target',
    parser: PointParser,
  },
  {
    code: 11,
    name: 'direction',
    parser: PointParser,
  },
  {
    code: 10,
    name: 'center',
    parser: PointParser,
  },
  {
    code: 41,
    name: 'width',
    parser: Identity,
  },
  {
    code: 40,
    name: 'height',
    parser: Identity,
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

export const parseViewTableEntry = createParser(ViewTableParserSnippets)
