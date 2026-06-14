import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { ShapeEntityParser } from './parser.ts'

describe('SHAPE', () => {
  test('basic case', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split(/\r\n|\r|\n/g))
    const parser = new ShapeEntityParser()

    let curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: '19AAD3',
      ownerBlockRecordSoftId: '19AA62',
      subclassMarker: 'AcDbShape',
      layer: '0',
      colorIndex: 7,
      insertionPoint: { x: 100, y: 200, z: 0 },
      size: 2.5,
      shapeName: 'ARROW',
      rotation: 45,
      xScale: 1.5,
      obliqueAngle: 10,
      thickness: 0.5,
      extrusionDirection: { x: 0, y: 0, z: 1 },
    })
  })
})
