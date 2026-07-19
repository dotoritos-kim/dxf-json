import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { CommonEntitySnippets } from '../shared.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
} from '../../shared/parserGenerator.ts'
import type { OleFrameEntity } from './types.ts'

const DefaultOleFrameEntity = {
  data: '',
}

/**
 * OLE binary (310) is listed after CommonEntitySnippets so it overrides
 * the common proxy-graphics mapping for the same group code.
 */
const OleFrameEntityParserSnippets: DXFParserSnippet[] = [
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

export class OleFrameEntityParser {
  static ForEntityName = 'OLEFRAME'
  private parser = createParser(OleFrameEntityParserSnippets, DefaultOleFrameEntity)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as OleFrameEntity
  }
}
