import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { CommonEntitySnippets } from '../shared.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
} from '../../shared/parserGenerator.ts'
import type { RayEntity } from './types.ts'

const RayEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 11,
    name: 'direction',
    parser: PointParser,
  },
  {
    code: 10,
    name: 'position',
    parser: PointParser,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
]

export class RayParser {
  static ForEntityName = 'RAY'
  private parser = createParser(RayEntityParserSnippets)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as RayEntity
  }
}
