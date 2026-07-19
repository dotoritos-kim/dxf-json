import { describe, test, expect } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { OleFrameEntityParser } from './parser.ts'

const OLEFRAME_DXF = [
  '5',
  'A1',
  '330',
  '1F',
  '100',
  'AcDbEntity',
  '8',
  '0',
  '100',
  'AcDbOleFrame',
  '70',
  '1',
  '90',
  '4',
  '310',
  '01020304',
  '1',
  'OLE',
  '0',
  'EOF',
]

describe('OLEFRAME', () => {
  test('parses oleframe fields and binary data', () => {
    const scanner = new DxfArrayScanner(OLEFRAME_DXF)
    const parser = new OleFrameEntityParser()

    const curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: 'A1',
      layer: '0',
      subclassMarker: 'AcDbOleFrame',
      version: 1,
      dataSize: 4,
      data: '01020304',
    })
    expect(entity).not.toHaveProperty('proxyEntity')
  })
})
