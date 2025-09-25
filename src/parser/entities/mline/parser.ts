import { CommonEntitySnippets } from '../shared';
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import { type DXFParserSnippet, Identity, PointParser, createParser } from '../../shared/parserGenerator';
import type { MLineEntity } from './types';

export const MLineElementParser: DXFParserSnippet[] = [
  {
    code: 42,
    name: 'fillParameters',
    parser: Identity,
    isMultiple: true,
  },
  {
    code: 75,
    name: 'fillCount',
    parser: Identity,
  },
  {
    code: 41,
    name: 'parameters',
    parser: Identity,
    isMultiple: true,
  },
  {
    code: 74,
    name: 'parameterCount',
    parser: Identity,
  },
]

export const MLineSegmentParser: DXFParserSnippet[] = [
  {
    code: [74, 41, 75, 42],
    name: 'elements',
    parser(curr, scanner) {
      const parser = createParser(MLineElementParser)
      const element = {}
      parser(curr, scanner, element)
      return element
    },
    isMultiple: true,
  },
  {
    code: 13,
    name: 'miterDirection',
    parser: PointParser,
  },
  {
    code: 12,
    name: 'direction',
    parser: PointParser,
  },
  {
    code: 11,
    name: 'position',
    parser: PointParser,
  }
]

export const MLineDXFEntitySnippet: DXFParserSnippet[] = [
  {
    code: [11, 12, 13],
    name: 'segments',
    parser(curr, scanner) {
      const parser = createParser(MLineSegmentParser)
      const segment = {}
      parser(curr, scanner, segment)
      return segment
    },
    isMultiple: true,
  },
  {
    code: 210,
    name: 'extrusionDirection',
    parser: PointParser,
  },
  {
    code: 10,
    name: 'startPosition',
    parser: PointParser,
  },
  {
    code: 73,
    name: 'styleCount',
    parser: Identity,
  },
  {
    code: 72,
    name: 'vertexCount',
    parser: Identity,
  },
  {
    code: 71,
    name: 'flags',
    parser: Identity,
  },
  {
    code: 70,
    name: 'justification',
    parser: Identity,
  },
  {
    code: 40,
    name: 'scale',
    parser: Identity,
  },
  {
    code: 340,
    name: 'styleObjectHandle',
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
    pushContext: true,
  },
  ...CommonEntitySnippets,
]

export class MLineEntityParser {
  static ForEntityName = 'MLINE'
  private parser = createParser(MLineDXFEntitySnippet)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): MLineEntity {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity
  }
}