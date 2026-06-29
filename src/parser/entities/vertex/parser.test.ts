import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { VertexParser } from './parser.ts'
import { VertexEntity } from './types.ts'

describe('VERTEX', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))

    let curr = scanner.next()
    curr = scanner.next() // skip 0

    const parser = new VertexParser()
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'VERTEX'

    expect(entity).toMatchObject<VertexEntity>({
      type: 'VERTEX',
      handle: 'AB',
      ownerBlockRecordSoftId: 'A1',
      layer: '36456188',
      subclassMarker: 'AcDb3dPolylineVertex',
      x: -68,
      y: 21,
      z: 37,
      flag: 32,
      startWidth: 0,
      endWidth: 0,
      bulge: 0,
      tangentDirection: 0,
    })
  })
})
