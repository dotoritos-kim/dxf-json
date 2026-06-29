import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseBlockRecordTable } from './parser.ts'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { BlockRecordTableEntry } from './types.ts'

describe('BLOCK_RECORD', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))

    let curr = scanner.next()

    const result = {} as BlockRecordTableEntry

    parseBlockRecordTable(curr, scanner, result)

    expect(result).toMatchObject<BlockRecordTableEntry>({
      subclassMarker: 'AcDbBlockTableRecord',
      handle: '1F',
      name: '*Model_Space',
      ownerObjectId: '1',
      layoutObjects: '22',
      insertionUnits: 0,
      explodability: 1,
      scalability: 0,
    })
  })

  test('tc1', () => {
    const content = readFileSync(join(__dirname, './tc1.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))

    let curr = scanner.next()

    const result = {} as BlockRecordTableEntry

    parseBlockRecordTable(curr, scanner, result)

    expect(result).toMatchObject<BlockRecordTableEntry>({
      subclassMarker: 'AcDbBlockTableRecord',
      handle: '1F',
      name: '*Model_Space',
      ownerObjectId: '1',
      layoutObjects: '22',
      insertionUnits: 0,
      explodability: 1,
      scalability: 0,
    })
  })
})
