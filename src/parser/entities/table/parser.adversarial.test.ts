/**
 * ACAD_TABLE 적대적/경계 테스트. 시나리오 정의는 ./TEST_SCENARIOS.md 참고.
 * 각 테스트 이름 앞의 ID(T-xx-nn)가 문서의 시나리오 ID와 1:1로 대응한다.
 */
import { describe, expect, test } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { DxfParser } from '../../DxfParser.ts'
import { TableEntityParser } from './parser.ts'

type G = [number, string | number]

/** 그룹코드/값 쌍을 DXF 줄 배열로 */
function lines(groups: G[]): string[] {
  return groups.flatMap(([c, v]) => [String(c), String(v)])
}

/** 엔티티 본문(0 ACAD_TABLE 다음부터)을 파싱하고, 파싱 후 다음 그룹도 반환 */
function parseBody(groups: G[], tail: G[] = [[0, 'ENDSEC']]) {
  const scanner = new DxfArrayScanner(lines([...groups, ...tail]))
  const entity = new TableEntityParser().parseEntity(scanner, scanner.next())
  return { entity, next: scanner.hasNext() ? scanner.next() : null }
}

/** ENTITIES 섹션만 있는 전체 DXF 문자열 */
function dxf(entities: G[], eol = '\n') {
  return lines([
    [0, 'SECTION'],
    [2, 'ENTITIES'],
    ...entities,
    [0, 'ENDSEC'],
    [0, 'EOF'],
  ]).join(eol)
}

function parseFull(entities: G[], eol = '\n') {
  return new DxfParser().parseSync(dxf(entities, eol))
}

const HEADER: G[] = [
  [5, 'A1'],
  [330, '1F'],
  [100, 'AcDbEntity'],
  [8, 'TBL'],
  [100, 'AcDbBlockReference'],
  [2, '*T1'],
  [10, 1],
  [20, 2],
  [30, 3],
  [100, 'AcDbTable'],
  [280, 0],
  [342, '28C'],
  [343, '28D'],
  [11, 1],
  [21, 0],
  [31, 0],
  [90, 22],
  [91, 1],
  [92, 2],
  [93, 0],
  [141, 7.5],
  [142, 30],
  [142, 20],
]

function textCell(text: string, extra: G[] = []): G[] {
  return [
    [171, 1],
    [172, 0],
    [173, 0],
    [175, 1],
    [176, 1],
    ...extra,
    [301, 'CELL_VALUE'],
    [93, 0],
    [90, 4],
    [1, text],
    [94, 0],
    [302, text],
    [304, 'ACVALUE_END'],
  ]
}

const SIMPLE: G[] = [...HEADER, ...textCell('A'), ...textCell('B')]
const LINE: G[] = [
  [0, 'LINE'],
  [5, 'L1'],
  [8, '0'],
  [10, 0],
  [20, 0],
  [30, 0],
  [11, 1],
  [21, 1],
  [31, 0],
]

describe('ACAD_TABLE 정상(N)', () => {
  test('T-N-01 헤더 전 그룹코드', () => {
    const { entity, next } = parseBody([
      ...HEADER,
      [210, 0],
      [220, 0],
      [230, 1],
      [94, 1],
      [95, 2],
      [96, 3],
      ...textCell('A'),
    ])
    expect(entity).toMatchObject({
      handle: 'A1',
      ownerBlockRecordSoftId: '1F',
      layer: 'TBL',
      name: '*T1',
      startPoint: { x: 1, y: 2, z: 3 },
      version: 0,
      tableStyleId: '28C',
      blockRecordHandle: '28D',
      directionVector: { x: 1, y: 0, z: 0 },
      tableValue: 22,
      rowCount: 1,
      columnCount: 2,
      overrideFlag: 0,
      borderColorOverrideFlag: 1,
      borderLineweightOverrideFlag: 2,
      borderVisibilityOverrideFlag: 3,
      extrusionDirection: { x: 0, y: 0, z: 1 },
      rowHeights: [7.5],
      columnWidths: [30, 20],
      subclassMarker: 'AcDbTable',
    })
    expect(next).toEqual({ code: 0, value: 'ENDSEC' })
  })

  test('T-N-02 셀 스칼라/불리언 전 그룹코드', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [172, 4],
      [173, 1],
      [174, 1],
      [175, 3],
      [176, 2],
      [91, 7],
      [178, 6],
      [145, 90],
      [344, 'F1'],
      [7, 'Standard'],
      [140, 2.5],
      [170, 5],
      [64, 1],
      [63, 2],
      [283, 1],
      [69, 3],
      [65, 4],
      [66, 5],
      [68, 6],
      [279, 13],
      [275, 25],
      [276, 35],
      [278, 50],
      [289, 1],
      [285, 0],
      [286, 1],
      [288, 0],
      [92, 9],
    ])
    expect(entity.cells[0]).toEqual({
      cellType: 1,
      flag: 4,
      mergedValue: 1,
      autoFit: 1,
      borderWidth: 3,
      borderHeight: 2,
      overrideFlag: 7,
      virtualEdgeFlag: 6,
      rotation: 90,
      fieldObjectId: 'F1',
      textStyle: 'Standard',
      textHeight: 2.5,
      alignment: 5,
      textColor: 1,
      backgroundColor: 2,
      isBackgroundFilled: true,
      topBorderColor: 3,
      rightBorderColor: 4,
      bottomBorderColor: 5,
      leftBorderColor: 6,
      topBorderLineweight: 13,
      rightBorderLineweight: 25,
      bottomBorderLineweight: 35,
      leftBorderLineweight: 50,
      topBorderVisibility: true,
      rightBorderVisibility: false,
      bottomBorderVisibility: true,
      leftBorderVisibility: false,
      extendedFlags: 9,
    })
  })

  test('T-N-03 CELL_VALUE 전 필드(long/double/point/format)', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [93, 1],
      [90, 2],
      [91, 42],
      [140, 3.25],
      [11, 4],
      [21, 5],
      [31, 6],
      [94, 3],
      [300, '%lu2'],
      [302, '3.25'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value).toEqual({
      flags: 1,
      dataType: 2,
      long: 42,
      double: 3.25,
      point: { x: 4, y: 5, z: 6 },
      unitType: 3,
      formatString: '%lu2',
      formattedValue: '3.25',
    })
  })

  test('T-N-04 블록 셀(340/144/179/331/300)', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 2],
      [340, '1A2'],
      [144, 1.5],
      [179, 2],
      [331, 'B1'],
      [300, 'V1'],
      [331, 'B2'],
      [300, 'V2'],
    ])
    expect(entity.cells[0]).toMatchObject({
      cellType: 2,
      blockTableRecordHandle: '1A2',
      blockScale: 1.5,
      attrDefCount: 2,
      attrDefHandles: ['B1', 'B2'],
      attrDefTexts: ['V1', 'V2'],
    })
  })

  test('T-N-05 레거시 셀 텍스트(1)', () => {
    const { entity } = parseBody([...HEADER, [171, 1], [1, 'legacy']])
    expect(entity.cells[0].text).toBe('legacy')
  })

  test('T-N-06 tc0 fixture 원본 회귀', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split(/\r\n|\r|\n/g))
    const entity = new TableEntityParser().parseEntity(scanner, scanner.next())
    expect(entity.cells).toHaveLength(3)
    expect(entity.cells[0].value?.string).toBe('Hello-World')
  })
})

describe('ACAD_TABLE 기본값/누락(D)', () => {
  test('T-D-01 헤더만, 셀 없음', () => {
    const { entity, next } = parseBody(HEADER)
    expect(entity.cells).toEqual([])
    expect(next).toEqual({ code: 0, value: 'ENDSEC' })
  })

  test('T-D-02 141/142 없음 -> 빈 배열 기본값', () => {
    const { entity } = parseBody([[5, 'A'], [8, '0'], [171, 1]])
    expect(entity.rowHeights).toEqual([])
    expect(entity.columnWidths).toEqual([])
    expect(entity.cells).toHaveLength(1)
  })

  test('T-D-03 기본값 배열은 인스턴스마다 독립', () => {
    const p = new TableEntityParser()
    const s1 = new DxfArrayScanner(lines([[5, 'A'], [0, 'ENDSEC']]))
    const e1 = p.parseEntity(s1, s1.next())
    e1.rowHeights.push(99)
    const s2 = new DxfArrayScanner(lines([[5, 'B'], [0, 'ENDSEC']]))
    const e2 = p.parseEntity(s2, s2.next())
    expect(e2.rowHeights).toEqual([])
  })

  test('T-D-04 CELL_VALUE 비어 있음', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value).toEqual({})
  })

  test('T-D-05 셀의 선택 필드 미존재 시 키가 생기지 않음', () => {
    const { entity } = parseBody([...HEADER, [171, 1]])
    expect(entity.cells[0]).toEqual({ cellType: 1 })
  })

  test('T-D-06 전체 파서 경유 handle 없음 -> ensureHandle', () => {
    const doc = parseFull([[0, 'ACAD_TABLE'], [8, '0'], [171, 1]])
    const t = doc.entities[0] as any
    expect(t.type).toBe('ACAD_TABLE')
    expect(t.handle).toBeDefined()
  })
})

describe('ACAD_TABLE 경계값(B)', () => {
  test('T-B-01 0 / 음수 / 매우 큰 값', () => {
    const { entity } = parseBody([
      [5, 'A'],
      [91, 0],
      [92, -1],
      [141, -0],
      [142, 1e308],
      [10, -1e9],
      [20, 0],
      [30, 0],
      [171, 1],
      [175, 2147483647],
      [176, -5],
    ])
    expect(entity.rowCount).toBe(0)
    expect(entity.columnCount).toBe(-1)
    expect(entity.columnWidths).toEqual([1e308])
    expect(entity.startPoint.x).toBe(-1e9)
    expect(entity.cells[0].borderWidth).toBe(2147483647)
    expect(entity.cells[0].borderHeight).toBe(-5)
  })

  test('T-B-02 지수 표기 실수', () => {
    const { entity } = parseBody([
      [5, 'A'],
      [141, '1.5E+01'],
      [142, '2e-3'],
      [171, 1],
      [140, '3.5E0'],
    ])
    expect(entity.rowHeights).toEqual([15])
    expect(entity.columnWidths).toEqual([0.002])
    expect(entity.cells[0].textHeight).toBe(3.5)
  })

  test('T-B-03 숫자 자리에 문자열 -> NaN 이지만 크래시 없음', () => {
    const { entity, next } = parseBody([
      [5, 'A'],
      [91, 'abc'],
      [141, 'x'],
      [171, 1],
      [175, 'NaN'],
      [140, ''],
    ])
    expect(entity.rowCount).toBeNaN()
    expect(entity.rowHeights[0]).toBeNaN()
    expect(entity.cells[0].borderWidth).toBeNaN()
    expect(entity.cells[0].textHeight).toBeNaN()
    expect(next?.value).toBe('ENDSEC')
  })

  test('T-B-04 171 값이 NaN 이어도 셀은 생성', () => {
    const { entity } = parseBody([[5, 'A'], [171, 'zz'], [172, 1]])
    expect(entity.cells).toHaveLength(1)
    expect(entity.cells[0].cellType).toBeNaN()
    expect(entity.cells[0].flag).toBe(1)
  })

  test('T-B-05 빈 문자열 텍스트', () => {
    const { entity } = parseBody([...HEADER, ...textCell('')])
    expect(entity.cells[0].value).toMatchObject({ string: '', formattedValue: '' })
  })

  test('T-B-06 유니코드/한글/이모지/\\U+ 이스케이프는 원문 유지', () => {
    const { entity } = parseBody([
      ...HEADER,
      ...textCell('한글 셀 😀'),
      ...textCell('\\U+D55C\\U+AE00'),
      [171, 1],
      [1, '\\P줄바꿈{\\fArial;x}'],
    ])
    expect(entity.cells[0].value?.string).toBe('한글 셀 😀')
    expect(entity.cells[1].value?.string).toBe('\\U+D55C\\U+AE00')
    expect(entity.cells[2].text).toBe('\\P줄바꿈{\\fArial;x}')
  })

  test('T-B-07 숫자처럼 보이는 텍스트는 문자열 유지(앞자리 0)', () => {
    const { entity } = parseBody([...HEADER, ...textCell('007')])
    expect(entity.cells[0].value?.string).toBe('007')
  })

  test('T-B-08 숫자 값 앞뒤 공백 패딩', () => {
    const { entity } = parseBody([[5, 'A'], [91, '   3  '], [141, ' 7.5 '], [171, '  1']])
    expect(entity.rowCount).toBe(3)
    expect(entity.rowHeights).toEqual([7.5])
    expect(entity.cells[0].cellType).toBe(1)
  })

  test('T-B-09 0행 0열', () => {
    const { entity } = parseBody([[5, 'A'], [91, 0], [92, 0]])
    expect(entity).toMatchObject({ rowCount: 0, columnCount: 0, cells: [] })
  })
})

describe('ACAD_TABLE 청크 텍스트/병합/셀 수(C)', () => {
  test('T-C-01 CELL_VALUE 2 청크 + 1', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [2, 'a'.repeat(250)],
      [2, 'b'.repeat(250)],
      [1, 'c'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value?.string).toBe('a'.repeat(250) + 'b'.repeat(250) + 'c')
  })

  test('T-C-02 CELL_VALUE 3 청크 + 1', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [3, 'x'],
      [3, 'y'],
      [1, 'z'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value?.string).toBe('xyz')
  })

  test('T-C-03 셀 레거시 텍스트 2/3 청크 + 1', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [2, 'p'],
      [3, 'q'],
      [1, 'r'],
    ])
    expect(entity.cells[0].text).toBe('pqr')
  })

  test('T-C-04 청크만 있고 1 없음 -> 청크를 문자열로', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [2, 'only'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value?.string).toBe('only')
  })

  test('T-C-05 청크는 셀 경계를 넘지 않음', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [2, 'leak'],
      [171, 1],
      [1, 'clean'],
    ])
    expect(entity.cells[1].text).toBe('clean')
  })

  test('T-C-06 숫자 같은 청크도 문자열 연결(덧셈 아님)', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [2, '1'],
      [2, '2'],
      [1, '3'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value?.string).toBe('123')
  })

  test('T-C-07 병합 셀(173=1, 175/176 span)', () => {
    const { entity } = parseBody([
      [5, 'A'],
      [91, 2],
      [92, 2],
      [171, 1],
      [173, 0],
      [175, 2],
      [176, 2],
      [171, 1],
      [173, 1],
      [171, 1],
      [173, 1],
      [171, 1],
      [173, 1],
    ])
    expect(entity.cells.map((c) => c.mergedValue)).toEqual([0, 1, 1, 1])
    expect(entity.cells[0]).toMatchObject({ borderWidth: 2, borderHeight: 2 })
  })

  test('T-C-08 셀 수 < 행x열: 있는 그대로 반환', () => {
    const { entity } = parseBody([[5, 'A'], [91, 3], [92, 3], [171, 1]])
    expect(entity.cells).toHaveLength(1)
    expect(entity.rowCount * entity.columnCount).toBe(9)
  })

  test('T-C-09 셀 수 > 행x열: 있는 그대로 반환', () => {
    const extra = Array.from({ length: 5 }, () => [171, 1] as G)
    const { entity } = parseBody([[5, 'A'], [91, 1], [92, 1], ...extra])
    expect(entity.cells).toHaveLength(5)
  })
})

describe('ACAD_TABLE 순서/중복(O)', () => {
  test('T-O-01 헤더 그룹 순서 뒤섞임', () => {
    const { entity } = parseBody([
      [92, 4],
      [91, 3],
      [8, 'L'],
      [5, 'A'],
      [142, 1],
      [141, 2],
      [2, '*T9'],
      [171, 1],
    ])
    expect(entity).toMatchObject({
      columnCount: 4,
      rowCount: 3,
      layer: 'L',
      handle: 'A',
      name: '*T9',
      cells: [{ cellType: 1 }],
    })
  })

  test('T-O-02 셀 내부 순서 뒤섞임(값 블록이 앞)', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [1, 'v'],
      [304, 'ACVALUE_END'],
      [175, 3],
      [172, 1],
    ])
    expect(entity.cells[0]).toMatchObject({ borderWidth: 3, flag: 1, value: { string: 'v' } })
  })

  test('T-O-03 셀 스칼라 중복 -> 마지막 값', () => {
    const { entity } = parseBody([...HEADER, [171, 1], [140, 1], [140, 2]])
    expect(entity.cells[0].textHeight).toBe(2)
  })

  test('T-O-04 헤더 단일값 중복: 첫 값 유지, 크래시 없음, 셀은 계속 파싱 (현재 동작)', () => {
    // 비다중 스니펫은 한 번 소비되면 pop 되므로 두 번째 91 에서 헤더 파서가 멈춘다.
    const { entity, next } = parseBody([
      [5, 'A'],
      [91, 1],
      [91, 2],
      [92, 5],
      [171, 1],
    ])
    expect(entity.rowCount).toBe(1)
    expect(entity.cells).toHaveLength(1)
    expect(next?.value).toBe('ENDSEC')
  })

  test('T-O-05 CELL_VALUE 두 번 -> 마지막 블록', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [301, 'CELL_VALUE'],
      [1, 'first'],
      [304, 'ACVALUE_END'],
      [301, 'CELL_VALUE'],
      [1, 'second'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value?.string).toBe('second')
  })

  test('T-O-06 같은 parser 인스턴스로 연속 파싱 시 헤더 스니펫 재사용', () => {
    const p = new TableEntityParser()
    for (const h of ['X', 'Y']) {
      const s = new DxfArrayScanner(lines([[5, h], [91, 2], [92, 3], [0, 'ENDSEC']]))
      const e = p.parseEntity(s, s.next())
      expect(e).toMatchObject({ handle: h, rowCount: 2, columnCount: 3 })
    }
  })
})

describe('ACAD_TABLE 구조 적대적(S)', () => {
  test('T-S-01 잘린 엔티티(EOF 그룹 없이 끝)', () => {
    const scanner = new DxfArrayScanner(lines([...HEADER, [171, 1], [172, 0]]))
    const entity = new TableEntityParser().parseEntity(scanner, scanner.next())
    expect(entity.cells).toHaveLength(1)
  })

  test('T-S-02 CELL_VALUE 도중 잘림(304 없음)', () => {
    const scanner = new DxfArrayScanner(
      lines([...HEADER, [171, 1], [301, 'CELL_VALUE'], [1, 'cut']]),
    )
    const entity = new TableEntityParser().parseEntity(scanner, scanner.next())
    expect(entity.cells[0].value?.string).toBe('cut')
  })

  test('T-S-03 CELL_VALUE 도중 0 -> 값 종료, 다음 엔티티 보존', () => {
    const { entity, next } = parseBody(
      [...HEADER, [171, 1], [301, 'CELL_VALUE'], [1, 'x']],
      LINE,
    )
    expect(entity.cells[0].value?.string).toBe('x')
    expect(next).toEqual({ code: 0, value: 'LINE' })
  })

  test('T-S-04 헤더 직후 EOF', () => {
    const scanner = new DxfArrayScanner(lines([[5, 'A'], [0, 'EOF']]))
    const entity = new TableEntityParser().parseEntity(scanner, scanner.next())
    expect(entity).toMatchObject({ handle: 'A', cells: [] })
    // 헤더 파서가 EOF 를 소비해도 이후 next() 는 EOF 를 돌려준다
    expect(scanner.next()).toEqual({ code: 0, value: 'EOF' })
  })

  test('T-S-05 0 바로 다음 다른 엔티티(빈 본문)', () => {
    const doc = parseFull([[0, 'ACAD_TABLE'], ...LINE])
    expect(doc.entities.map((e) => e.type)).toEqual(['ACAD_TABLE', 'LINE'])
  })

  test('T-S-06 알 수 없는 그룹코드(셀 안)는 무시', () => {
    const { entity, next } = parseBody([
      ...HEADER,
      [171, 1],
      [999, 'comment'],
      [177, 5],
      [4000, 'weird'],
      [172, 2],
    ])
    expect(entity.cells[0]).toEqual({ cellType: 1, flag: 2 })
    expect(next?.value).toBe('ENDSEC')
  })

  test('T-S-07 헤더 중간 알 수 없는 코드: 헤더 파싱 중단, 셀은 계속 (현재 동작)', () => {
    const { entity } = parseBody([[5, 'A'], [177, 1], [91, 9], [171, 1]])
    expect(entity.handle).toBe('A')
    expect(entity.rowCount).toBeUndefined()
    expect(entity.cells).toHaveLength(1)
  })

  test('T-S-08 셀 이전의 1/301/331 은 무시', () => {
    const { entity } = parseBody([
      [5, 'A'],
      [177, 0],
      [1, 'orphan'],
      [331, 'H'],
      [301, 'CELL_VALUE'],
      [304, 'ACVALUE_END'],
      [171, 1],
    ])
    expect(entity.cells).toEqual([{ cellType: 1 }])
  })

  test('T-S-09 잘못된 불리언(283=2)은 스캐너가 정수로 파싱 -> true/false 변환', () => {
    const { entity } = parseBody([...HEADER, [171, 1], [283, 2], [289, 0]])
    expect(typeof entity.cells[0].isBackgroundFilled).toBe('boolean')
    expect(entity.cells[0].topBorderVisibility).toBe(false)
  })

  test('T-S-10 XDATA(엔티티 끝, 셀 뒤)', () => {
    const { entity, next } = parseBody([
      ...SIMPLE,
      [1001, 'ACAD'],
      [1000, 'hello'],
      [1070, 3],
    ])
    expect(entity.cells).toHaveLength(2)
    expect(entity.xdata).toEqual([{ appName: 'ACAD', value: ['hello', 3] }])
    expect(next?.value).toBe('ENDSEC')
  })

  test('T-S-11 XDATA 가 셀 값을 오염시키지 않음', () => {
    const { entity } = parseBody([...SIMPLE, [1001, 'APP'], [1000, 'x'], [1040, 1.5]])
    expect(entity.cells[1]).toMatchObject({ value: { string: 'B' } })
    expect(entity.cells[1].text).toBeUndefined()
  })

  test('T-S-12 리액터/확장딕셔너리(헤더)', () => {
    const { entity } = parseBody([
      [5, 'A'],
      [102, '{ACAD_REACTORS'],
      [330, 'R1'],
      [102, '}'],
      [102, '{ACAD_XDICTIONARY'],
      [360, 'D1'],
      [102, '}'],
      [330, '1F'],
      [100, 'AcDbEntity'],
      [8, '0'],
      [171, 1],
    ])
    expect(entity.layer).toBe('0')
    expect(entity.ownerBlockRecordSoftId).toBe('1F')
    expect(entity.cells).toHaveLength(1)
  })

  test('T-S-13 셀 안의 102 블록은 무시되고 셀 필드 유지', () => {
    const { entity } = parseBody([
      ...HEADER,
      [171, 1],
      [102, '{APP'],
      [1, 'not-text?'],
      [102, '}'],
      [172, 3],
    ])
    expect(entity.cells).toHaveLength(1)
    expect(entity.cells[0].flag).toBe(3)
  })

  test('T-S-14 CRLF 줄바꿈 + 공백 패딩된 그룹코드', () => {
    const raw = lines([...SIMPLE])
      .map((l, i) => (i % 2 === 0 ? `  ${l}` : l))
      .join('\r\n')
    const doc = new DxfParser().parseSync(
      ['  0', 'SECTION', '  2', 'ENTITIES', '  0', 'ACAD_TABLE', raw, '  0', 'ENDSEC', '  0', 'EOF'].join(
        '\r\n',
      ),
    )
    const t = doc.entities[0] as any
    expect(t.cells).toHaveLength(2)
    expect(t.cells[0].value.string).toBe('A')
    expect(t.layer).toBe('TBL')
  })

  test('T-S-15 셀 뒤 표 레벨 override 그룹은 마지막 셀 필드를 덮어쓸 수 있음 (현재 동작 문서화)', () => {
    // tc0 처럼 셀 뒤에 70/40/41/280/281 등이 나오면 셀 필드가 아닌 것은 무시된다.
    const { entity } = parseBody([...HEADER, [171, 1], [172, 1], [70, 0], [40, 1], [41, 1], [280, 0], [281, 0]])
    expect(entity.cells[0]).toEqual({ cellType: 1, flag: 1 })
  })

  test('T-S-16 0 그룹 값이 공백 패딩/소문자인 다음 엔티티', () => {
    const { next } = parseBody(SIMPLE, [[0, 'line']])
    expect(next).toEqual({ code: 0, value: 'line' })
  })

  test('T-S-17 304 가 셀 밖에 단독으로 등장', () => {
    const { entity } = parseBody([...HEADER, [171, 1], [304, 'ACVALUE_END'], [172, 1]])
    expect(entity.cells[0]).toEqual({ cellType: 1, flag: 1 })
  })

  test.todo('T-S-18 290~299 불리언 코드에 0/1 외 값이면 스캐너가 TypeError (공통 스캐너 정책)')
})

describe('ACAD_TABLE 연속/혼합/BLOCKS(M) - DxfParser.parseSync', () => {
  test('T-M-01 TABLE 다음 LINE 보존', () => {
    const doc = parseFull([[0, 'ACAD_TABLE'], ...SIMPLE, ...LINE])
    expect(doc.entities.map((e) => e.type)).toEqual(['ACAD_TABLE', 'LINE'])
    expect((doc.entities[1] as any).handle).toBe('L1')
  })

  test('T-M-02 TABLE 연속 3개', () => {
    const doc = parseFull([
      [0, 'ACAD_TABLE'],
      ...SIMPLE,
      [0, 'ACAD_TABLE'],
      [5, 'B2'],
      [0, 'ACAD_TABLE'],
      ...HEADER.map(([c, v]) => (c === 5 ? [5, 'C3'] : [c, v]) as G),
      ...textCell('Z'),
    ])
    const tables = doc.entities as any[]
    expect(tables.map((t) => t.handle)).toEqual(['A1', 'B2', 'C3'])
    expect(tables.map((t) => t.cells.length)).toEqual([2, 0, 1])
  })

  test('T-M-03 LINE / TABLE / LINE 샌드위치 + XDATA', () => {
    const doc = parseFull([
      ...LINE,
      [0, 'ACAD_TABLE'],
      ...SIMPLE,
      [1001, 'ACAD'],
      [1000, 'x'],
      ...LINE.map(([c, v]) => (c === 5 ? [5, 'L2'] : [c, v]) as G),
    ])
    expect(doc.entities.map((e: any) => e.handle)).toEqual(['L1', 'A1', 'L2'])
  })

  test('T-M-04 BLOCKS 내부 TABLE', () => {
    const content = lines([
      [0, 'SECTION'],
      [2, 'BLOCKS'],
      [0, 'BLOCK'],
      [5, 'BK'],
      [8, '0'],
      [2, '*T1'],
      [70, 1],
      [10, 0],
      [20, 0],
      [30, 0],
      [3, '*T1'],
      [0, 'ACAD_TABLE'],
      ...SIMPLE,
      ...LINE,
      [0, 'ENDBLK'],
      [5, 'BE'],
      [8, '0'],
      [100, 'AcDbBlockEnd'],
      [0, 'ENDSEC'],
      [0, 'SECTION'],
      [2, 'ENTITIES'],
      ...LINE,
      [0, 'ENDSEC'],
      [0, 'EOF'],
    ]).join('\n')
    const doc = new DxfParser().parseSync(content)
    const block = doc.blocks['*T1'] as any
    expect(block.entities.map((e: any) => e.type)).toEqual(['ACAD_TABLE', 'LINE'])
    expect(block.entities[0].cells).toHaveLength(2)
    expect(doc.entities.map((e) => e.type)).toEqual(['LINE'])
  })

  test('T-M-05 TABLE 이 ENDSEC 직전 마지막 엔티티 -> 다음 섹션 정상', () => {
    const content = lines([
      [0, 'SECTION'],
      [2, 'ENTITIES'],
      [0, 'ACAD_TABLE'],
      ...SIMPLE,
      [0, 'ENDSEC'],
      [0, 'SECTION'],
      [2, 'OBJECTS'],
      [0, 'ENDSEC'],
      [0, 'EOF'],
    ]).join('\n')
    const doc = new DxfParser().parseSync(content)
    expect(doc.entities).toHaveLength(1)
  })

  test('T-M-06 섹션이 EOF 로 잘려도 크래시 없음', () => {
    const content = lines([[0, 'SECTION'], [2, 'ENTITIES'], [0, 'ACAD_TABLE'], ...SIMPLE]).join('\n')
    expect(() => new DxfParser().parseSync(content)).not.toThrow()
  })
})

describe('ACAD_TABLE 회귀(R)', () => {
  test('T-R-01 TABLE 의 코드 2/1/7 이 인접 TEXT 에 새지 않음', () => {
    const doc = parseFull([
      [0, 'ACAD_TABLE'],
      ...SIMPLE,
      [0, 'TEXT'],
      [5, 'T1'],
      [8, '0'],
      [10, 0],
      [20, 0],
      [30, 0],
      [40, 1],
      [1, 'plain'],
    ])
    const text = doc.entities[1] as any
    expect(text.type).toBe('TEXT')
    expect(text.text).toBe('plain')
  })

  test('T-R-02 TABLE 앞뒤 엔티티 개수 동일(TABLE 제거 시와 비교)', () => {
    const others: G[] = [...LINE, ...LINE.map(([c, v]) => (c === 5 ? [5, 'L9'] : [c, v]) as G)]
    const without = parseFull(others)
    const withTable = parseFull([...others.slice(0, LINE.length), [0, 'ACAD_TABLE'], ...SIMPLE, ...others.slice(LINE.length)])
    expect(withTable.entities.length).toBe(without.entities.length + 1)
  })

  test('T-R-03 tc0 통합 도면 파싱 크래시 없음', () => {
    const content = readFileSync(
      join(__dirname, '../../../../integration-test/src/tc0/tc.dxf'),
      'utf-8',
    )
    expect(() => new DxfParser().parseSync(content)).not.toThrow()
  })
})

describe('ACAD_TABLE 성능(P)', () => {
  test('T-P-01 1만 셀 테이블 파싱 < 2초', () => {
    const cells: G[] = []
    for (let i = 0; i < 10_000; i++) cells.push(...textCell(`c${i}`))
    const start = performance.now()
    const { entity, next } = parseBody([[5, 'A'], [91, 100], [92, 100], ...cells])
    expect(performance.now() - start).toBeLessThan(2000)
    expect(entity.cells).toHaveLength(10_000)
    expect(entity.cells[9999].value?.string).toBe('c9999')
    expect(next?.value).toBe('ENDSEC')
  })

  test('T-P-02 TABLE 1천 개 반복(전체 파서)', () => {
    const ents: G[] = []
    for (let i = 0; i < 1000; i++) ents.push([0, 'ACAD_TABLE'], [5, `H${i}`], ...textCell('x'))
    const doc = parseFull(ents)
    expect(doc.entities).toHaveLength(1000)
    expect((doc.entities[999] as any).handle).toBe('H999')
  })

  test('T-P-03 매우 긴 청크(1MB) 연결', () => {
    const chunk = 'k'.repeat(250)
    const chunks: G[] = Array.from({ length: 4000 }, () => [2, chunk] as G)
    const { entity } = parseBody([
      [5, 'A'],
      [171, 1],
      [301, 'CELL_VALUE'],
      ...chunks,
      [1, '!'],
      [304, 'ACVALUE_END'],
    ])
    expect(entity.cells[0].value?.string?.length).toBe(1_000_001)
  })
})
