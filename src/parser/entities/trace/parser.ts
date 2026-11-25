import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { generateIntegers } from '../../../utlis.ts'
import { CommonEntitySnippets } from '../shared.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
} from '../../shared/parserGenerator.ts'
import type { TraceEntity } from './types.ts'

const DefaultTraceEntity = {
  points: [],
  thickness: 0,
  extrusionDirection: { x: 0, y: 0, z: 1 },
}

const TraceEntityParserSnippets: DXFParserSnippet[] = [
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
]

export class TraceEntityParser {
  static ForEntityName = 'TRACE'
  private parser = createParser(TraceEntityParserSnippets, DefaultTraceEntity)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as TraceEntity
  }
}
