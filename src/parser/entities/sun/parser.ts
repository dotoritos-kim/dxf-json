import { CommonEntitySnippets } from '../shared.ts'
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  type DXFParserSnippet,
  Identity,
  ToBoolean,
  createParser,
} from '../../shared/parserGenerator.ts'
import type { SunEntity } from './types.ts'

export const SunEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 280,
    name: 'shadowMapSoftness',
    parser: Identity,
  },
  {
    code: 71,
    name: 'shadowMapSize',
    parser: Identity,
  },
  {
    code: 70,
    name: 'shadowType',
    parser: Identity,
  },
  {
    code: 292,
    name: 'isSummerTime',
    parser: ToBoolean,
  },
  {
    code: 92,
    name: 'time',
    parser: Identity,
  },
  {
    code: 91,
    name: 'julianDay',
    parser: Identity,
  },
  {
    code: 291,
    name: 'hasShadow',
    parser: ToBoolean,
  },
  {
    code: 40,
    name: 'intensity',
    parser: Identity,
  },
  {
    code: 421,
    name: 'lightColorInstance',
    parser: Identity,
  },
  {
    code: 63,
    name: 'lightColorIndex',
    parser: Identity,
  },
  {
    code: 290,
    name: 'isOn',
    parser: ToBoolean,
  },
  {
    code: 90,
    name: 'version',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
    pushContext: true,
  },
  // For some reason, SUN doesn't have `AcDbEntity` subclass marker.
  ...CommonEntitySnippets.filter((snippet) => snippet.code !== 100),
]

export class SunEntityParser {
  static ForEntityName = 'SUN'
  private parser = createParser(SunEntityParserSnippets)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): SunEntity {
    const entity = { layer: '' } as any
    this.parser(curr, scanner, entity)
    return entity
  }
}
