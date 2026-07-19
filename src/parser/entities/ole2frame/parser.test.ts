import { describe, test, expect } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { OleObjectType, OleTileMode } from './consts.ts'
import { Ole2FrameEntityParser } from './parser.ts'

const OLE2FRAME_DXF = [
  '5',
  '2D',
  '100',
  'AcDbEntity',
  '67',
  '1',
  '8',
  '0',
  '100',
  'AcDbOle2Frame',
  '70',
  '2',
  '3',
  'Paintbrush Picture',
  '10',
  '4.43116',
  '20',
  '5.665992',
  '30',
  '0.0',
  '11',
  '6.4188',
  '21',
  '4.244939',
  '31',
  '0.0',
  '71',
  '2',
  '72',
  '1',
  '73',
  '2',
  '90',
  '8',
  '310',
  '01020304',
  '310',
  '05060708',
  '1',
  'OLE',
  '0',
  'EOF',
]

describe('OLE2FRAME', () => {
  test('parses ole2frame fields and concatenated binary data', () => {
    const scanner = new DxfArrayScanner(OLE2FRAME_DXF)
    const parser = new Ole2FrameEntityParser()

    const curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: '2D',
      layer: '0',
      isInPaperSpace: true,
      subclassMarker: 'AcDbOle2Frame',
      version: 2,
      name: 'Paintbrush Picture',
      upperLeftCorner: { x: 4.43116, y: 5.665992, z: 0.0 },
      lowerRightCorner: { x: 6.4188, y: 4.244939, z: 0.0 },
      oleObjectType: OleObjectType.Embedded,
      tileMode: OleTileMode.PaperSpace,
      quality: 2,
      dataSize: 8,
      data: '0102030405060708',
    })
    expect(entity).not.toHaveProperty('proxyEntity')
  })
})
