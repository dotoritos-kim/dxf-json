/**
 * SHAPE 엔티티 적대적/경계 테스트. 시나리오 정의는 ./TEST_SCENARIOS.md 참고.
 * 각 test 이름 앞의 ID 가 문서의 시나리오 ID 와 1:1 로 대응한다.
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { DxfParser } from '../../DxfParser.ts'
import { ShapeEntityParser } from './parser.ts'
import { parseEntities } from '../parser.ts'

type Pair = [number, string | number]

const toLines = (pairs: Pair[], eol = '\n') =>
  pairs.map(([c, v]) => `${String(c).padStart(3, ' ')}${eol}${v}`).join(eol)

/** 엔티티 파서 단독 호출 (0/SHAPE 이후 그룹부터) */
function parseShape(pairs: Pair[]) {
  const scanner = new DxfArrayScanner(
    toLines([...pairs, [0, 'EOF']]).split('\n'),
  )
  const entity = new ShapeEntityParser().parseEntity(scanner, scanner.next())
  return { entity: entity as any, next: scanner.next() }
}

/** parseEntities 경유 (0/SHAPE 포함) */
function parseList(pairs: Pair[]) {
  const scanner = new DxfArrayScanner(
    toLines([...pairs, [0, 'ENDSEC'], [0, 'EOF']]).split('\n'),
  )
  return parseEntities(scanner.next(), scanner) as any[]
}

/** DxfParser.parseSync 경유 */
function parseFull(entityPairs: Pair[], eol = '\n') {
  const doc = toLines(
    [
      [0, 'SECTION'],
      [2, 'ENTITIES'],
      ...entityPairs,
      [0, 'ENDSEC'],
      [0, 'EOF'],
    ],
    eol,
  )
  return new DxfParser().parseSync(doc)
}

const head = (handle = '1A'): Pair[] => [
  [5, handle],
  [100, 'AcDbEntity'],
  [8, '0'],
  [100, 'AcDbShape'],
]
const body = (name = 'BOX'): Pair[] => [
  [10, 1],
  [20, 2],
  [30, 3],
  [40, 5],
  [2, name],
]
const shape = (handle = '1A', extra: Pair[] = [], name = 'BOX'): Pair[] => [
  [0, 'SHAPE'],
  ...head(handle),
  ...body(name),
  ...extra,
]
const line = (handle = '2C'): Pair[] => [
  [0, 'LINE'],
  [5, handle],
  [100, 'AcDbEntity'],
  [8, '0'],
  [100, 'AcDbLine'],
  [10, 0],
  [20, 0],
  [30, 0],
  [11, 1],
  [21, 1],
  [31, 0],
]

describe('SHAPE / N 정상', () => {
  test('N-01 레퍼런스 전 그룹코드', () => {
    const { entity, next } = parseShape([
      ...head('ABC'),
      [330, '1F'],
      [6, 'DASHED'],
      [62, 3],
      [370, 25],
      [48, 2],
      [60, 1],
      [67, 1],
      [410, 'Layout1'],
      [39, 0.25],
      [10, 1.5],
      [20, -2.5],
      [30, 3],
      [40, 7],
      [2, 'ARROW'],
      [50, 30],
      [41, 0.8],
      [51, 15],
      [210, 0],
      [220, 1],
      [230, 0],
    ])
    expect(entity).toMatchObject({
      handle: 'ABC',
      ownerBlockRecordSoftId: '1F',
      lineType: 'DASHED',
      colorIndex: 3,
      lineweight: 25,
      lineTypeScale: 2,
      isVisible: true,
      isInPaperSpace: true,
      layoutTabName: 'Layout1',
      subclassMarker: 'AcDbShape',
      thickness: 0.25,
      insertionPoint: { x: 1.5, y: -2.5, z: 3 },
      size: 7,
      shapeName: 'ARROW',
      rotation: 30,
      xScale: 0.8,
      obliqueAngle: 15,
      extrusionDirection: { x: 0, y: 1, z: 0 },
    })
    expect(next).toMatchObject({ code: 0, value: 'EOF' })
  })

  test('N-02 tc0 픽스처', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split(/\r\n|\r|\n/g))
    const e = new ShapeEntityParser().parseEntity(scanner, scanner.next())
    expect(e.shapeName).toBe('ARROW')
    expect(e.insertionPoint).toEqual({ x: 100, y: 200, z: 0 })
  })

  test('N-03 2D 삽입점(30 없음)', () => {
    const { entity } = parseShape([
      ...head(),
      [10, 4],
      [20, 5],
      [40, 1],
      [2, 'A'],
    ])
    expect(entity.insertionPoint).toEqual({ x: 4, y: 5 })
  })
})

describe('SHAPE / D 기본값·누락', () => {
  test('D-01 선택 코드 전부 누락 시 기본값', () => {
    const { entity } = parseShape([...head(), ...body()])
    expect(entity).toMatchObject({
      thickness: 0,
      rotation: 0,
      xScale: 1,
      obliqueAngle: 0,
      extrusionDirection: { x: 0, y: 0, z: 1 },
    })
  })

  test('D-02 기본값 객체는 엔티티마다 독립 복사', () => {
    const a = parseShape([...head(), ...body()]).entity
    const b = parseShape([...head(), ...body()]).entity
    a.extrusionDirection.z = 99
    expect(b.extrusionDirection.z).toBe(1)
    expect(a.extrusionDirection).not.toBe(b.extrusionDirection)
  })

  test('D-03 필수 코드(10/40/2) 누락 시 크래시 없이 필드 없음', () => {
    const { entity } = parseShape(head())
    expect(entity.insertionPoint).toBeUndefined()
    expect(entity.size).toBeUndefined()
    expect(entity.shapeName).toBeUndefined()
    expect(entity.xScale).toBe(1)
  })

  test('D-04 그룹 하나도 없는 SHAPE (0 바로 다음 0)', () => {
    const list = parseList([[0, 'SHAPE'], ...line()])
    expect(list.map((e) => e.type)).toEqual(['SHAPE', 'LINE'])
    expect(list[0].xScale).toBe(1)
    expect(typeof list[0].handle).toBe('number') // ensureHandle 가 채움
  })

  test('D-05 AcDbEntity 마커 없이 AcDbShape만 (현재 동작 문서화)', () => {
    const { entity } = parseShape([
      [5, '1'],
      [8, '0'],
      [100, 'AcDbShape'],
      ...body(),
    ])
    // 100 은 공통 스니펫(이름 없음)이 먼저 소비 → subclassMarker 미설정
    expect(entity.subclassMarker).toBeUndefined()
    expect(entity.shapeName).toBe('BOX')
  })
})

describe('SHAPE / B 경계값', () => {
  test.each([
    ['0', 0],
    ['-0', -0],
    ['-12.5', -12.5],
    ['1e308', 1e308],
    ['1.5E+3', 1500],
    ['2.5e-10', 2.5e-10],
    ['   7.25   ', 7.25],
  ])('B-01 size 값 %j', (raw, expected) => {
    const { entity } = parseShape([...head(), [40, raw], [2, 'X']])
    expect(entity.size).toBe(expected)
    expect(entity.shapeName).toBe('X')
  })

  test('B-02 1e309 → Infinity (overflow, 현재 동작)', () => {
    const { entity } = parseShape([...head(), [40, '1e309'], [2, 'X']])
    expect(entity.size).toBe(Infinity)
  })

  test.each(['NaN', 'abc', ''])('B-03 숫자 아닌 값 %j → NaN, 다음 코드 유지', (raw) => {
    const { entity } = parseShape([...head(), [50, raw], [40, 1], [2, 'X']])
    expect(entity.rotation).toBeNaN()
    expect(entity.size).toBe(1)
    expect(entity.shapeName).toBe('X')
  })

  test('B-04 음수 각도/배율, 360 초과 회전 보존(정규화 안 함)', () => {
    const { entity } = parseShape([
      ...head(),
      ...body(),
      [50, -450],
      [41, -2],
      [51, 720],
      [39, -1],
    ])
    expect(entity).toMatchObject({
      rotation: -450,
      xScale: -2,
      obliqueAngle: 720,
      thickness: -1,
    })
  })

  test('B-05 xScale 0, size 0', () => {
    const { entity } = parseShape([...head(), [40, 0], [2, 'Z'], [41, 0]])
    expect(entity.size).toBe(0)
    expect(entity.xScale).toBe(0)
  })

  test('B-06 빈 shapeName', () => {
    const { entity } = parseShape([...head(), [40, 1], [2, ''], [50, 5]])
    expect(entity.shapeName).toBe('')
    expect(entity.rotation).toBe(5)
  })

  test.each([
    ['한글모양', '한글모양'],
    ['ARROW_ü€', 'ARROW_ü€'],
    ['\\U+D55C\\U+AE00', '\\U+D55C\\U+AE00'],
    ['  PAD  ', '  PAD  '],
    ['A B\tC', 'A B\tC'],
  ])('B-07 shapeName 문자열 %j 원문 보존', (raw, expected) => {
    const { entity } = parseShape([...head(), [40, 1], [2, raw]])
    expect(entity.shapeName).toBe(expected)
  })

  test('B-08 매우 긴 shapeName (10만자)', () => {
    const name = 'S'.repeat(100_000)
    const { entity } = parseShape([...head(), [40, 1], [2, name]])
    expect(entity.shapeName).toHaveLength(100_000)
  })

  test('B-09 extrusion 영벡터·비정규 벡터 그대로 보존', () => {
    const { entity } = parseShape([
      ...head(),
      ...body(),
      [210, 0],
      [220, 0],
      [230, 0],
    ])
    expect(entity.extrusionDirection).toEqual({ x: 0, y: 0, z: 0 })
  })
})

describe('SHAPE / O 순서·중복', () => {
  test('O-01 그룹코드 순서 뒤섞임', () => {
    const { entity } = parseShape([
      [2, 'MIX'],
      [51, 3],
      [40, 9],
      [100, 'AcDbShape'],
      [8, 'L'],
      [10, 1],
      [20, 2],
      [30, 3],
      [50, 4],
      [100, 'AcDbEntity'],
      [5, 'FF'],
      [41, 2],
    ])
    expect(entity).toMatchObject({
      shapeName: 'MIX',
      obliqueAngle: 3,
      size: 9,
      layer: 'L',
      insertionPoint: { x: 1, y: 2, z: 3 },
      rotation: 4,
      handle: 'FF',
      xScale: 2,
    })
  })

  test('O-02 단일 코드 중복 → 파싱 중단, 이후 필드 유실 (현재 동작)', () => {
    const { entity, next } = parseShape([
      ...head(),
      [40, 1],
      [40, 2],
      [2, 'LOST'],
    ])
    expect(entity.size).toBe(1)
    expect(entity.shapeName).toBeUndefined()
    // 스캐너는 중복된 그룹에 되감겨 있음
    expect(next).toMatchObject({ code: 40, value: 2 })
  })

  test('O-03 중복 코드가 있어도 parseEntities 는 다음 엔티티를 잃지 않음', () => {
    const list = parseList([
      ...shape('1', [
        [40, 9],
        [50, 1],
      ]),
      ...line('2'),
    ])
    expect(list.map((e) => [e.type, e.handle])).toEqual([
      ['SHAPE', '1'],
      ['LINE', '2'],
    ])
  })

  test('O-04 Y 만 있고 X 없는 점(20 단독) → 파싱 중단, 크래시 없음', () => {
    const list = parseList([
      [0, 'SHAPE'],
      ...head('9'),
      [20, 5],
      [40, 1],
      ...line('A'),
    ])
    expect(list.map((e) => e.type)).toEqual(['SHAPE', 'LINE'])
    expect(list[0].insertionPoint).toBeUndefined()
  })

  test('O-05 10 다음 30 (20 누락) → throw 하지 않고 y=0 으로 복구 (#189)', () => {
    const { entity: e } = parseShape([...head(), [10, 1], [30, 3], [40, 1]])
    expect(e.insertionPoint).toMatchObject({ x: 1, y: 0 })
  })
})

describe('SHAPE / S 구조 적대적', () => {
  test('S-01 잘린 엔티티 (값 줄 없이 EOF)', () => {
    const scanner = new DxfArrayScanner(
      ['  0', 'SHAPE', '  5', '1A', ' 40'].map(String),
    )
    expect(() => {
      const curr = scanner.next()
      parseEntities(curr, scanner)
    }).not.toThrow()
  })

  test('S-02 SHAPE 직후 EOF', () => {
    const scanner = new DxfArrayScanner(toLines([[0, 'SHAPE'], [0, 'EOF']]).split('\n'))
    const list = parseEntities(scanner.next(), scanner)
    expect(list).toHaveLength(1)
    expect(list[0].type).toBe('SHAPE')
  })

  test('S-03 SHAPE 바로 다음 다른 엔티티 연속', () => {
    const list = parseList([
      [0, 'SHAPE'],
      [0, 'SHAPE'],
      ...head('X'),
      ...line('Y'),
    ])
    expect(list.map((e) => e.type)).toEqual(['SHAPE', 'SHAPE', 'LINE'])
    expect(list[1].handle).toBe('X')
  })

  test('S-04 알 수 없는 그룹코드 → 이후 필드 유실, 다음 엔티티 유지 (현재 동작)', () => {
    const list = parseList([
      [0, 'SHAPE'],
      ...head('U'),
      [10, 1],
      [20, 2],
      [30, 3],
      [999, 'comment'],
      [40, 5],
      [2, 'AFTER'],
      ...line('L'),
    ])
    expect(list.map((e) => e.type)).toEqual(['SHAPE', 'LINE'])
    expect(list[0].insertionPoint).toEqual({ x: 1, y: 2, z: 3 })
    expect(list[0].shapeName).toBeUndefined()
  })

  test('S-05 잘못된 타입(문자열 좌표) → NaN', () => {
    const { entity } = parseShape([
      ...head(),
      [10, 'x'],
      [20, 'y'],
      [30, 'z'],
      [40, 1],
      [2, 'T'],
    ])
    expect(entity.insertionPoint.x).toBeNaN()
    expect(entity.shapeName).toBe('T')
  })

  test('S-06 그룹코드 줄 자체가 숫자가 아님', () => {
    const scanner = new DxfArrayScanner(
      ['  0', 'SHAPE', 'XX', 'junk', ...toLines(line('L')).split('\n'), '  0', 'EOF'],
    )
    let list: any[] = []
    expect(() => {
      list = parseEntities(scanner.next(), scanner)
    }).not.toThrow()
    expect(list.map((e) => e.type)).toEqual(['SHAPE', 'LINE'])
  })

  test('S-07 XDATA 포함', () => {
    const { entity } = parseShape([
      ...head(),
      ...body(),
      [50, 10],
      [1001, 'MYAPP'],
      [1000, 'hello'],
      [1040, 3.5],
    ])
    expect(entity.rotation).toBe(10)
    expect(entity.xdata).toBeDefined()
    expect(JSON.stringify(entity.xdata)).toContain('MYAPP')
  })

  test('S-08 리액터·확장딕셔너리 그룹', () => {
    const { entity } = parseShape([
      [5, 'R1'],
      [102, '{ACAD_REACTORS'],
      [330, '1F'],
      [102, '}'],
      [102, '{ACAD_XDICTIONARY'],
      [360, '2F'],
      [102, '}'],
      [330, '1E'],
      [100, 'AcDbEntity'],
      [8, '0'],
      [100, 'AcDbShape'],
      ...body('RX'),
    ])
    expect(entity.handle).toBe('R1')
    expect(entity.ownerBlockRecordSoftId).toBe('1E')
    expect(entity.shapeName).toBe('RX')
    expect(entity.extensions).toBeDefined()
  })

  test('S-09 CRLF 줄바꿈 + parseSync', () => {
    const dxf = parseFull([...shape('C1', [[50, 15]], 'CRLF'), ...line('C2')], '\r\n')
    const [s, l] = dxf.entities as any[]
    expect(s).toMatchObject({ type: 'SHAPE', handle: 'C1', shapeName: 'CRLF', rotation: 15 })
    expect(l).toMatchObject({ type: 'LINE', handle: 'C2' })
  })

  test('S-10 그룹코드·숫자 공백 패딩', () => {
    const scanner = new DxfArrayScanner(
      [
        '   5', '1A', '100', 'AcDbEntity', '  8', '0', '100', 'AcDbShape',
        '  10  ', '  1.0  ', '20', '2', '30', '3', ' 40 ', '\t5\t', '   2', 'BOX', '  0', 'EOF',
      ],
    )
    const e = new ShapeEntityParser().parseEntity(scanner, scanner.next()) as any
    expect(e.insertionPoint).toEqual({ x: 1, y: 2, z: 3 })
    expect(e.size).toBe(5)
    expect(e.shapeName).toBe('BOX')
  })

  test('S-11 BOM·빈 줄 섞인 입력 parseSync 크래시 없음', () => {
    const text = '﻿' + toLines([[0, 'SECTION'], [2, 'ENTITIES'], ...shape('B'), [0, 'ENDSEC'], [0, 'EOF']])
    expect(() => new DxfParser().parseSync(text)).not.toThrow()
  })
})

describe('SHAPE / M 연속·혼합·BLOCKS', () => {
  test('M-01 SHAPE 연속 3개 + LINE 혼합', () => {
    const list = parseList([
      ...shape('1', [], 'A'),
      ...line('2'),
      ...shape('3', [[50, 90]], 'B'),
      ...shape('4', [], 'C'),
    ])
    expect(list.map((e) => `${e.type}:${e.handle}`)).toEqual([
      'SHAPE:1',
      'LINE:2',
      'SHAPE:3',
      'SHAPE:4',
    ])
    expect(list[2].rotation).toBe(90)
    expect(list[3].rotation).toBe(0)
  })

  test('M-02 BLOCKS 내부 SHAPE (parseSync)', () => {
    const doc = toLines([
      [0, 'SECTION'],
      [2, 'BLOCKS'],
      [0, 'BLOCK'],
      [5, '20'],
      [100, 'AcDbEntity'],
      [8, '0'],
      [100, 'AcDbBlockBegin'],
      [2, 'BLK'],
      [70, 0],
      [10, 0],
      [20, 0],
      [30, 0],
      [3, 'BLK'],
      [1, ''],
      ...shape('21', [[41, 2]], 'INBLK'),
      ...line('22'),
      [0, 'ENDBLK'],
      [5, '23'],
      [100, 'AcDbEntity'],
      [8, '0'],
      [100, 'AcDbBlockEnd'],
      [0, 'ENDSEC'],
      [0, 'SECTION'],
      [2, 'ENTITIES'],
      ...shape('30', [], 'TOP'),
      [0, 'ENDSEC'],
      [0, 'EOF'],
    ])
    const dxf = new DxfParser().parseSync(doc)
    const blk = (dxf.blocks as any).BLK
    expect(blk.entities.map((e: any) => e.type)).toEqual(['SHAPE', 'LINE'])
    expect(blk.entities[0]).toMatchObject({ shapeName: 'INBLK', xScale: 2 })
    expect(dxf.entities).toHaveLength(1)
    expect(dxf.entities[0]).toMatchObject({ type: 'SHAPE', shapeName: 'TOP' })
  })

  test('M-03 SHAPE 다음 ENDSEC 직후 다른 섹션도 정상', () => {
    const dxf = parseFull(shape('E1'))
    expect(dxf.entities).toHaveLength(1)
  })
})

describe('SHAPE / R 회귀', () => {
  test('R-01 SHAPE 파서가 뒤따르는 LINE 필드를 오염시키지 않음', () => {
    const list = parseList([...shape('1', [[39, 7]]), ...line('2')])
    expect(list[1]).not.toHaveProperty('shapeName')
    expect(list[1]).not.toHaveProperty('xScale')
    expect(list[1].startPoint).toEqual({ x: 0, y: 0, z: 0 })
  })

  test('R-02 파서 인스턴스 재사용 시 상태 누수 없음', () => {
    const p = new ShapeEntityParser()
    const run = (pairs: Pair[]) => {
      const s = new DxfArrayScanner(toLines([...pairs, [0, 'EOF']]).split('\n'))
      return p.parseEntity(s, s.next()) as any
    }
    const a = run([...head(), ...body('A'), [50, 45]])
    const b = run([...head(), ...body('B')])
    expect(a.rotation).toBe(45)
    expect(b.rotation).toBe(0)
    expect(b.shapeName).toBe('B')
  })

  test('R-03 TEXT 의 code 2/50/41/51 처리에 영향 없음', () => {
    const list = parseList([
      ...shape('1'),
      [0, 'TEXT'],
      [5, '2'],
      [100, 'AcDbEntity'],
      [8, '0'],
      [100, 'AcDbText'],
      [10, 0],
      [20, 0],
      [30, 0],
      [40, 2],
      [1, 'hi'],
      [50, 30],
    ])
    expect(list[1]).toMatchObject({ type: 'TEXT', text: 'hi', rotation: 30 })
    expect(list[1]).not.toHaveProperty('shapeName')
  })
})

describe('SHAPE / P 성능', () => {
  test('P-01 SHAPE 2만 개 parseSync 시간 제한 내', () => {
    const N = 20_000
    const pairs: Pair[] = []
    for (let i = 0; i < N; i++) {
      pairs.push(...shape(i.toString(16).toUpperCase(), [[50, i % 360]], `S${i}`))
    }
    const t0 = performance.now()
    const dxf = parseFull(pairs)
    const dt = performance.now() - t0
    expect(dxf.entities).toHaveLength(N)
    expect((dxf.entities[N - 1] as any).shapeName).toBe(`S${N - 1}`)
    expect(dt).toBeLessThan(10_000)
  })
})

describe('SHAPE / C 완전성 보강', () => {
  test('C-01 공통 엔티티 코드(6/62/420/440/370/48/67/410) 정확한 값', () => {
    const { entity } = parseShape([
      [5, 'C1'],
      [100, 'AcDbEntity'],
      [8, 'LYR'],
      [6, 'DASHED'],
      [62, 3],
      [420, 255],
      [440, 33554687],
      [370, 25],
      [48, 2.5],
      [67, 1],
      [410, 'Layout1'],
      [100, 'AcDbShape'],
      ...body('C'),
    ])
    expect(entity).toMatchObject({
      layer: 'LYR',
      lineType: 'DASHED',
      colorIndex: 3,
      color: 255,
      transparency: 33554687,
      lineweight: 25,
      lineTypeScale: 2.5,
      isInPaperSpace: true,
      layoutTabName: 'Layout1',
      shapeName: 'C',
    })
  })

  test('C-02 코드 60=1 은 DXF 상 "보이지 않음"인데 isVisible=true 로 매핑 (공통 동작 문서화)', () => {
    const { entity } = parseShape([...head(), [60, 1], ...body()])
    expect(entity.isVisible).toBe(true)
    const { entity: e0 } = parseShape([...head(), [60, 0], ...body()])
    expect(e0.isVisible).toBe(false)
  })

  test('C-03 XDATA 구조 정확히 (appName, value 순서·타입)', () => {
    const { entity } = parseShape([
      ...head(),
      ...body(),
      [1001, 'MYAPP'],
      [1000, 'hello'],
      [1040, 3.5],
    ])
    expect(entity.xdata).toEqual([{ appName: 'MYAPP', value: ['hello', 3.5] }])
  })

  test('C-04 리액터·확장딕셔너리 구조 정확히', () => {
    const { entity } = parseShape([
      [5, 'R1'],
      [102, '{ACAD_REACTORS'],
      [330, '1F'],
      [102, '}'],
      [102, '{ACAD_XDICTIONARY'],
      [360, '2F'],
      [102, '}'],
      [330, '1E'],
      [100, 'AcDbEntity'],
      [8, '0'],
      [100, 'AcDbShape'],
      ...body(),
    ])
    expect(entity.extensions).toEqual({
      ACAD_REACTORS: [{ code: 330, value: '1F' }],
      ACAD_XDICTIONARY: [{ code: 360, value: '2F' }],
    })
  })

  test.each(['__proto__', 'constructor', 'prototype'])(
    'C-05 shapeName %j 로 프로토타입 오염 없음',
    (name) => {
      const { entity } = parseShape([...head(), ...body(name)])
      expect(entity.shapeName).toBe(name)
      expect(({} as any).polluted).toBeUndefined()
      expect(Object.getPrototypeOf(entity)).toBe(Object.prototype)
    },
  )

  test('C-06 extrusion 210/220/230 각 축 값 정확히 매핑', () => {
    const { entity } = parseShape([...head(), ...body(), [210, 0.1], [220, -0.2], [230, 0.3]])
    expect(entity.extrusionDirection).toEqual({ x: 0.1, y: -0.2, z: 0.3 })
  })

  test('C-07 thickness·obliqueAngle·xScale 개별 지정 시 기본값 덮음', () => {
    const { entity } = parseShape([...head(), [39, 7], ...body(), [41, 0.5], [51, -15]])
    expect(entity).toMatchObject({ thickness: 7, xScale: 0.5, obliqueAngle: -15, rotation: 0 })
  })

  test('C-08 D-04 보강: 빈 SHAPE 에 ensureHandle 이 채운 handle 은 고유한 숫자(현재 동작, 문자열 handle 과 타입 다름)', () => {
    const list = parseList([[0, 'SHAPE'], [0, 'SHAPE'], ...line()])
    expect(typeof list[0].handle).toBe('number')
    expect(list[1].handle).toBe(list[0].handle + 1)
    expect(list[0].handle).not.toBe(list[1].handle)
  })
})
