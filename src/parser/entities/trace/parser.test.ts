import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { TraceEntityParser } from './parser.ts'
import { TraceEntity } from './types.ts'

describe('TraceEntity Parser', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parseEntity = new TraceEntityParser()

    let curr = scanner.next()
    curr = scanner.next()
    const entity = parseEntity.parseEntity(scanner, curr)
    entity.type = 'TRACE'

    expect(entity).toMatchObject<Partial<TraceEntity>>({
      type: 'TRACE',
      handle: '7147',
      ownerBlockRecordSoftId: '7129',
      layer: 'NOI THAT',
      subclassMarker: 'AcDbTrace',
      thickness: 2.5,
      points: [
        { x: -0.0000014461311366, y: 749.9999991504999, z: 0 },
        { x: -0.0000014461311366, y: 719.9999991504999, z: 0 },
        { x: 929.9999985538689, y: 749.9999991504999, z: 0 },
        { x: 929.9999985538689, y: 719.9999991504999, z: 0 },
      ],
      extrusionDirection: { x: 0, y: 0, z: -1 },
    })
    expect(scanner.next()).toMatchObject({ code: 0, value: 'EOF' })
  })

  test('applies defaults when optional codes are absent', () => {
    const scanner = new DxfArrayScanner([
      '0', 'TRACE', '8', '0', '10', '1', '20', '2', '0', 'EOF',
    ])
    const parser = new TraceEntityParser()
    scanner.next()
    const entity = parser.parseEntity(scanner, scanner.next())
    expect(entity.thickness).toBe(0)
    expect(entity.extrusionDirection).toEqual({ x: 0, y: 0, z: 1 })
    expect(entity.points).toEqual([{ x: 1, y: 2 }])
  })
})
