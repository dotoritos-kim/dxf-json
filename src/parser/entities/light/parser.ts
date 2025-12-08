import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  type DXFParserSnippet,
  Identity,
  PointParser,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets } from '../shared.ts'
import type { LightEntity } from './types.ts'

export const LightEntitySnippet: DXFParserSnippet[] = [
  {
    code: 280,
    name: 'shadowMapSoftness',
    parser: Identity,
  },
  {
    code: 91,
    name: 'shadowMapSize',
    parser: Identity,
  },
  {
    code: 73,
    name: 'shadowType',
    parser: Identity,
  },
  {
    code: 293,
    name: 'isShadowCast',
    parser: ToBoolean,
  },
  {
    code: 51,
    name: 'falloffAngle',
    parser: Identity,
  },
  {
    code: 50,
    name: 'hotspotAngle',
    parser: Identity,
  },
  {
    code: 42,
    name: 'limitEnd',
    parser: Identity,
  },
  {
    code: 41,
    name: 'limitStart',
    parser: Identity,
  },
  {
    code: 292,
    name: 'isAttenuationLimited',
    parser: ToBoolean,
  },
  {
    code: 72,
    name: 'attenuationType',
    parser: Identity,
  },
  {
    code: 11,
    name: 'target',
    parser: PointParser,
  },
  {
    code: 10,
    name: 'position',
    parser: PointParser,
  },
  {
    code: 40,
    name: 'intensity',
    parser: Identity,
  },
  {
    code: 291,
    name: 'isPlotGlyph',
    parser: ToBoolean,
  },
  {
    code: 290,
    name: 'isOn',
    parser: ToBoolean,
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
    code: 70,
    name: 'lightType',
    parser: Identity,
  },
  {
    code: 1,
    name: 'name',
    parser: Identity,
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
  },
  ...CommonEntitySnippets,
]

export class LightEntityParser {
  static ForEntityName = 'LIGHT'
  private parser = createParser(LightEntitySnippet)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): LightEntity {
    const entity = {} as LightEntity
    this.parser(curr, scanner, entity)
    return entity
  }
}
