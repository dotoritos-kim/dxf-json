import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { ShadowType } from '../consts.ts'
import { SunEntityParser } from './parser.ts'
import { SunEntity } from './types.ts'

describe('SunEntity Parser', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parseEntity = new SunEntityParser()

    let curr = scanner.next()
    curr = scanner.next()
    const entity = parseEntity.parseEntity(scanner, curr)
    entity.type = 'SUN'

    expect(entity).toMatchObject<SunEntity>({
      type: 'SUN',
      handle: '2B9',
      layer: '',
      extensions: {
        ACAD_XDICTIONARY: [
          {
            code: 360,
            value: '2C1',
          },
        ],
      },
      ownerBlockRecordSoftId: 'EA',
      subclassMarker: 'AcDbSun',
      version: 1,
      isOn: true,
      lightColorIndex: 7,
      lightColorInstance: 16777215,
      intensity: 2,
      hasShadow: true,
      julianDay: 2460940,
      time: 54900000,
      isSummerTime: true,
      shadowType: ShadowType.RayTrace,
      shadowMapSize: 256,
      shadowMapSoftness: 1,
    })
  })
})
