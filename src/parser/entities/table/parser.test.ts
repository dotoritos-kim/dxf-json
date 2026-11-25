import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { TableEntityParser } from './parser.ts'

describe('ACAD_TABLE', () => {
  test('basic case', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split(/\r\n|\r|\n/g))
    const parser = new TableEntityParser()

    const curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: '29F',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      colorIndex: 256,
      subclassMarker: 'AcDbTable',
      name: '*T1',
      startPoint: { x: 408.2, y: 340.8, z: 0 },
      version: 0,
      tableStyleId: '28C',
      blockRecordHandle: '28D',
      directionVector: { x: 1, y: 0, z: 0 },
      tableValue: 0,
      rowCount: 1,
      columnCount: 3,
      overrideFlag: 0,
      rowHeights: [7.5],
      columnWidths: [30, 20, 10],
    })
    expect(entity.cells).toHaveLength(3)
    expect(entity.cells[0]).toMatchObject({
      cellType: 1,
      flag: 0,
      mergedValue: 0,
      autoFit: 0,
      borderWidth: 2,
      borderHeight: 1,
      overrideFlag: 262201,
      textStyle: 'Standard',
      textHeight: 3.5,
      alignment: 5,
      textColor: 0,
      extendedFlags: 0,
      value: {
        flags: 0,
        dataType: 4,
        string: 'Hello-World',
        unitType: 0,
        formattedValue: 'Hello-World',
      },
    })
    expect(entity.cells[1]).toMatchObject({
      cellType: 1,
      mergedValue: 1,
      isBackgroundFilled: true,
      backgroundColor: 3,
      value: { flags: 3, dataType: 0 },
    })
    expect(entity.cells[2]).toMatchObject({
      cellType: 2,
      blockTableRecordHandle: '1A2',
      blockScale: 1.5,
      attrDefCount: 1,
      attrDefHandles: ['1B3'],
      attrDefTexts: ['ATTVAL'],
    })

    // 엔티티 끝(0 그룹)에서 멈춰야 함
    expect(scanner.next()).toMatchObject({ code: 0, value: 'ENDSEC' })
  })
})
