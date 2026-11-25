import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets } from '../shared.ts'
import type { SeqendEntity } from './types.ts'

const SeqendEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
]

export class SeqendEntityParser {
  static ForEntityName = 'SEQEND'
  private parser = createParser(SeqendEntityParserSnippets)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as SeqendEntity
  }
}
