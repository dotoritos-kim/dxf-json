import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseEntities } from '../parser.ts'
import { SeqendEntityParser } from './parser.ts'
import type { SeqendEntity } from './types.ts'

function scan(text: string) {
  return new DxfArrayScanner(text.split('\n'))
}

describe('SEQEND', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = scan(content)

    let curr = scanner.next()
    curr = scanner.next() // skip 0

    const entity = new SeqendEntityParser().parseEntity(scanner, curr)
    entity.type = 'SEQEND'

    expect(entity).toMatchObject<Partial<SeqendEntity>>({
      type: 'SEQEND',
      handle: '1A3',
      ownerBlockRecordSoftId: '19F',
      layer: 'WALL',
    })
    // parser must stop right before the next entity
    expect(scanner.next()).toMatchObject({ code: 0, value: 'EOF' })
  })

  test('terminates POLYLINE vertex sequence', () => {
    const content = [
      '0', 'POLYLINE', '5', '10', '8', '0', '100', 'AcDbEntity',
      '100', 'AcDb2dPolyline', '66', '1', '10', '0', '20', '0', '30', '0', '70', '1',
      '0', 'VERTEX', '5', '11', '330', '10', '8', '0', '100', 'AcDbVertex',
      '100', 'AcDb2dVertex', '10', '1', '20', '2', '30', '0',
      '0', 'VERTEX', '5', '12', '330', '10', '8', '0', '100', 'AcDbVertex',
      '100', 'AcDb2dVertex', '10', '3', '20', '4', '30', '0',
      '0', 'SEQEND', '5', '13', '330', '10', '100', 'AcDbEntity', '8', '0',
      '0', 'LINE', '5', '14', '8', '0', '100', 'AcDbEntity', '100', 'AcDbLine',
      '10', '0', '20', '0', '30', '0', '11', '1', '21', '1', '31', '0',
      '0', 'ENDSEC', '0', 'EOF',
    ].join('\n')
    const scanner = scan(content)
    const entities = parseEntities(scanner.next(), scanner) as any[]

    expect(entities.map((e) => e.type)).toEqual(['POLYLINE', 'SEQEND', 'LINE'])
    expect(entities[0].vertices).toHaveLength(2)
    expect(entities[1]).toMatchObject({
      type: 'SEQEND',
      handle: '13',
      ownerBlockRecordSoftId: '10',
      layer: '0',
    })
    expect(entities[2].handle).toBe('14')
  })

  test('terminates INSERT attribute sequence', () => {
    const content = [
      '0', 'INSERT', '5', '20', '8', '0', '100', 'AcDbEntity',
      '100', 'AcDbBlockReference', '66', '1', '2', 'BLK',
      '10', '0', '20', '0', '30', '0',
      '0', 'ATTRIB', '5', '21', '330', '20', '8', '0', '100', 'AcDbEntity',
      '100', 'AcDbText', '10', '0', '20', '0', '30', '0', '40', '1', '1', 'V',
      '100', 'AcDbAttribute', '2', 'TAG', '70', '0',
      '0', 'SEQEND', '5', '22', '330', '20', '100', 'AcDbEntity', '8', '0',
      '0', 'ENDSEC', '0', 'EOF',
    ].join('\n')
    const scanner = scan(content)
    const entities = parseEntities(scanner.next(), scanner) as any[]

    expect(entities.map((e) => e.type)).toEqual(['INSERT', 'ATTRIB', 'SEQEND'])
    expect(entities[2]).toMatchObject({
      handle: '22',
      ownerBlockRecordSoftId: '20',
    })
  })
})
