import { describe, test, expect } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { AcadProxyEntityParser } from './parser.ts'

const PROXY_ENTITY_DXF = [
  '5',
  'A1',
  '330',
  '1F',
  '100',
  'AcDbEntity',
  '8',
  '0',
  '100',
  'AcDbProxyEntity',
  '1',
  'AECC_TIN_SURFACE',
  '90',
  '498',
  '91',
  '500',
  '92',
  '4',
  '310',
  '01020304',
  '93',
  '0',
  '94',
  '0',
  '95',
  '29',
  '70',
  '0',
  '0',
  'EOF',
]

describe('ACAD_PROXY_ENTITY', () => {
  test('parses proxy entity fields', () => {
    const scanner = new DxfArrayScanner(PROXY_ENTITY_DXF)
    const parser = new AcadProxyEntityParser()

    const curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: 'A1',
      layer: '0',
      subclassMarker: 'AcDbProxyEntity',
      originalDxfName: 'AECC_TIN_SURFACE',
      proxyEntityClassId: 498,
      applicationEntityClassId: 500,
      graphicsDataSize: 4,
      graphicsData: '01020304',
      entityDataSize: 0,
      objectDrawingFormat: 29,
      originalDataFormat: 0,
    })
  })
})
