import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { parsePoint } from '../../shared/parsePoint.ts'
import { CommonEntitySnippets } from '../shared.ts'
import type { TableCell, TableCellValue, TableEntity } from './types.ts'

// 헤더(AcDbEntity, AcDbBlockReference, AcDbTable 앞부분)는 첫 셀(171)까지
const TableHeaderSnippets: DXFParserSnippet[] = [
  { code: 210, name: 'extrusionDirection', parser: PointParser },
  { code: 142, name: 'columnWidths', parser: Identity, isMultiple: true },
  { code: 141, name: 'rowHeights', parser: Identity, isMultiple: true },
  { code: 96, name: 'borderVisibilityOverrideFlag', parser: Identity },
  { code: 95, name: 'borderLineweightOverrideFlag', parser: Identity },
  { code: 94, name: 'borderColorOverrideFlag', parser: Identity },
  { code: 93, name: 'overrideFlag', parser: Identity },
  { code: 91, name: 'rowCount', parser: Identity },
  { code: 90, name: 'tableValue', parser: Identity },
  { code: 11, name: 'directionVector', parser: PointParser },
  { code: 343, name: 'blockRecordHandle', parser: Identity },
  { code: 342, name: 'tableStyleId', parser: Identity },
  { code: 280, name: 'version', parser: Identity },
  { code: 10, name: 'startPoint', parser: PointParser },
  { code: 2, name: 'name', parser: Identity },
  ...CommonEntitySnippets,
  // 92는 공통 스니펫(proxy graphics)과 겹치므로 우선순위를 높인다
  { code: 92, name: 'columnCount', parser: Identity },
  // AcDbBlockReference / AcDbTable 서브클래스 마커. 마지막 값(AcDbTable)이 남는다.
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
    isMultiple: true,
    isReducible: true,
  },
]

const CellScalarFields: Record<number, keyof TableCell> = {
  172: 'flag',
  173: 'mergedValue',
  174: 'autoFit',
  175: 'borderWidth',
  176: 'borderHeight',
  91: 'overrideFlag',
  178: 'virtualEdgeFlag',
  145: 'rotation',
  344: 'fieldObjectId',
  7: 'textStyle',
  140: 'textHeight',
  170: 'alignment',
  64: 'textColor',
  63: 'backgroundColor',
  69: 'topBorderColor',
  65: 'rightBorderColor',
  66: 'bottomBorderColor',
  68: 'leftBorderColor',
  279: 'topBorderLineweight',
  275: 'rightBorderLineweight',
  276: 'bottomBorderLineweight',
  278: 'leftBorderLineweight',
  92: 'extendedFlags',
  340: 'blockTableRecordHandle',
  144: 'blockScale',
  179: 'attrDefCount',
}

const CellBooleanFields: Record<number, keyof TableCell> = {
  283: 'isBackgroundFilled',
  289: 'topBorderVisibility',
  285: 'rightBorderVisibility',
  286: 'bottomBorderVisibility',
  288: 'leftBorderVisibility',
}

export class TableEntityParser {
  static ForEntityName = 'ACAD_TABLE'
  private parser = createParser(TableHeaderSnippets, {
    rowHeights: [],
    columnWidths: [],
  })

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    entity.cells = []

    let cell: TableCell | null = null
    let textChunks = ''
    curr = scanner.next()

    while (curr.code !== 0) {
      const code = curr.code
      if (code === 1001) {
        // 엔티티 끝의 XDATA(셀 뒤에 위치). 헤더 파서에 위임하면 xdata 로 수집된다.
        this.parser(curr, scanner, entity)
      } else if (code === 171) {
        cell = { cellType: curr.value as number }
        textChunks = ''
        entity.cells.push(cell)
      } else if (cell) {
        if (code === 301) {
          cell.value = parseCellValue(scanner)
        } else if (code === 2 || code === 3) {
          textChunks += String(curr.value)
        } else if (code === 1) {
          cell.text = textChunks + String(curr.value)
          textChunks = ''
        } else if (code === 331) {
          ;(cell.attrDefHandles ??= []).push(String(curr.value))
        } else if (code === 300) {
          ;(cell.attrDefTexts ??= []).push(String(curr.value))
        } else if (code in CellBooleanFields) {
          ;(cell as any)[CellBooleanFields[code]] = ToBoolean(curr)
        } else if (code in CellScalarFields) {
          ;(cell as any)[CellScalarFields[code]] = curr.value as number
        }
        // 그 외(셀 뒤의 표 레벨 override 그룹 등)는 무시
      }
      curr = scanner.next()
    }
    scanner.rewind()

    return entity as TableEntity
  }
}

/** 301(CELL_VALUE) 다음부터 304(ACVALUE_END)까지 소비 */
function parseCellValue(scanner: DxfArrayScanner): TableCellValue {
  const value: TableCellValue = {}
  let chunks = ''
  let curr = scanner.next()

  // 304 가 빠진 손상 데이터에서 다음 셀(171)을 삼키지 않도록 171 에서도 멈춘다
  while (curr.code !== 0 && curr.code !== 304 && curr.code !== 171) {
    switch (curr.code) {
      case 93:
        value.flags = curr.value as number
        break
      case 90:
        value.dataType = curr.value as number
        break
      case 2:
      case 3:
        chunks += String(curr.value)
        break
      case 1:
        value.string = chunks + String(curr.value)
        chunks = ''
        break
      case 140:
        value.double = curr.value as number
        break
      case 91:
        value.long = curr.value as number
        break
      case 11:
        value.point = parsePoint(scanner) as any
        break
      case 94:
        value.unitType = curr.value as number
        break
      case 300:
        value.formatString = String(curr.value)
        break
      case 302:
        value.formattedValue = String(curr.value)
        break
    }
    curr = scanner.next()
  }
  if (curr.code === 0 || curr.code === 171) scanner.rewind()
  if (chunks && value.string === undefined) value.string = chunks
  return value
}
