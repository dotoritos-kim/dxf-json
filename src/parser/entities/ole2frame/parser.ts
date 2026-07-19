import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { CommonEntitySnippets } from '../shared.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
} from '../../shared/parserGenerator.ts'
import type { Ole2FrameEntity } from './types.ts'

const DefaultOle2FrameEntity = {
  data: '',
}

/**
 * OLE binary (310) is listed after CommonEntitySnippets so it overrides
 * the common proxy-graphics mapping for the same group code.
 */
const Ole2FrameEntityParserSnippets: DXFParserSnippet[] = [
  {
    // End of OLE data marker (the string "OLE")
    code: 1,
  },
  {
    code: 90,
    name: 'dataSize',
    parser: Identity,
  },
  {
    code: 73,
    name: 'quality',
    parser: Identity,
  },
  {
    code: 72,
    name: 'tileMode',
    parser: Identity,
  },
  {
    code: 71,
    name: 'oleObjectType',
    parser: Identity,
  },
  {
    code: 11,
    name: 'lowerRightCorner',
    parser: PointParser,
  },
  {
    code: 10,
    name: 'upperLeftCorner',
    parser: PointParser,
  },
  {
    code: 3,
    name: 'name',
    parser: Identity,
  },
  {
    code: 70,
    name: 'version',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
  {
    code: 310,
    name: 'data',
    isMultiple: true,
    isReducible: true,
    parser: (curr, _, entity) => (entity.data ?? '') + curr.value,
  },
]

export class Ole2FrameEntityParser {
  static ForEntityName = 'OLE2FRAME'
  private parser = createParser(
    Ole2FrameEntityParserSnippets,
    DefaultOle2FrameEntity,
  )

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as Ole2FrameEntity
  }
}
