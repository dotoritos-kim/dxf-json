import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { LightEntityParser } from './parser.ts'
import type { LightEntity } from './types.ts'
import { AttenuationType, LightType, ShadowType } from './consts.ts'

describe('LightDXFEntity parser', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new LightEntityParser()

    let curr = scanner.next()
    curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'LIGHT'

    expect(entity).toMatchObject<LightEntity>({
      type: 'LIGHT',
      handle: '2CE',
      extensions: {
        ACAD_XDICTIONARY: [
          {
            code: 360,
            value: '2CF',
          },
        ],
      },
      ownerBlockRecordSoftId: '1F',
      layer: '*ADSK_SYSTEM_LIGHTS',
      proxyByte: 8,
      proxyEntity: '0800000000000000',
      subclassMarker: 'AcDbLight',
      version: 1,
      name: 'light name',
      lightType: LightType.Point,
      isOn: true,
      lightColorIndex: 192,
      lightColorInstance: 6039756,
      isPlotGlyph: false,
      intensity: 1,
      position: { x: 87, y: 33, z: 0 },
      target: { x: 88, y: 34, z: -1 },
      attenuationType: AttenuationType.None,
      isAttenuationLimited: false,
      limitStart: 1,
      limitEnd: 10,
      hotspotAngle: 45,
      falloffAngle: 50,
      isShadowCast: true,
      shadowType: ShadowType.ShadowMap,
      shadowMapSize: 128,
      shadowMapSoftness: 5,
    })
  })
})
