import { describe, test, it, expect } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { DxfParser } from '../../DxfParser.ts'
import { TraceEntityParser } from './parser.ts'
import type { TraceEntity } from './types.ts'

// 시나리오 ID 는 TEST_SCENARIOS.md 와 1:1 로 대응한다.

/** 그룹코드/값 쌍 배열을 스캐너 라인으로 변환 */
function lines(pairs: Array<[number | string, string | number]>): string[] {
  return pairs.flatMap(([c, v]) => [String(c), String(v)])
}

/** TRACE 본문(0/TRACE 제외)만으로 엔티티 파서를 직접 호출 */
function parseBody(body: Array<[number | string, string | number]>) {
  const scanner = new DxfArrayScanner([
    ...lines([[0, 'TRACE'], ...body, [0, 'EOF']]),
  ])
  scanner.next()
  const entity = new TraceEntityParser().parseEntity(scanner, scanner.next())
  return { entity, scanner }
}

/** ENTITIES 섹션 하나짜리 DXF 문자열 */
function dxfWithEntities(
  entities: Array<[number | string, string | number]>,
  eol = '\n',
) {
  return lines([
    [0, 'SECTION'],
    [2, 'ENTITIES'],
    ...entities,
    [0, 'ENDSEC'],
    [0, 'EOF'],
  ]).join(eol)
}

function parseFull(entities: Array<[number | string, string | number]>, eol = '\n') {
  return new DxfParser().parseSync(dxfWithEntities(entities, eol))
}

const CORNERS: Array<[number, number]> = [
  [10, 0], [20, 0], [30, 0],
  [11, 10], [21, 0], [31, 0],
  [12, 0], [22, 5], [32, 0],
  [13, 10], [23, 5], [33, 0],
]

function trace(extra: Array<[number | string, string | number]> = []) {
  return [
    [0, 'TRACE'],
    [5, 'A1'],
    [100, 'AcDbEntity'],
    [8, 'L'],
    [100, 'AcDbTrace'],
    ...CORNERS,
    ...extra,
  ] as Array<[number | string, string | number]>
}

const LINE: Array<[number | string, string | number]> = [
  [0, 'LINE'], [5, 'B1'], [8, 'L'], [100, 'AcDbLine'],
  [10, 1], [20, 2], [30, 0], [11, 3], [21, 4], [31, 0],
]

describe('TRACE 정상 (N)', () => {
  test('N-01 레퍼런스 전 그룹코드', () => {
    const { entity, scanner } = parseBody([
      [5, '1F'], [330, '1A'], [100, 'AcDbEntity'], [67, 1], [8, 'Layer1'],
      [6, 'DASHED'], [62, 3], [370, 25], [48, 2.5], [60, 1], [420, 16711680],
      [440, 33554432], [100, 'AcDbTrace'], [39, 1.5],
      ...CORNERS, [210, 0], [220, 0], [230, -1],
    ])
    expect(entity).toMatchObject({
      handle: '1F',
      ownerBlockRecordSoftId: '1A',
      isInPaperSpace: true,
      layer: 'Layer1',
      lineType: 'DASHED',
      colorIndex: 3,
      lineweight: 25,
      lineTypeScale: 2.5,
      subclassMarker: 'AcDbTrace',
      thickness: 1.5,
      points: [
        { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 },
        { x: 0, y: 5, z: 0 }, { x: 10, y: 5, z: 0 },
      ],
      extrusionDirection: { x: 0, y: 0, z: -1 },
    })
    expect(entity.color).toBe(16711680)
    expect(entity.transparency).toBe(33554432)
    expect(scanner.next()).toMatchObject({ code: 0, value: 'EOF' })
  })

  test('N-02 2D 점(z 생략)', () => {
    const { entity } = parseBody([
      [10, 1], [20, 2], [11, 3], [21, 4], [12, 5], [22, 6], [13, 7], [23, 8],
    ])
    expect(entity.points).toEqual([
      { x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 7, y: 8 },
    ])
  })

  test('N-03 parseSync 경유 type/handle', () => {
    const dxf = parseFull(trace())
    expect(dxf.entities).toHaveLength(1)
    expect(dxf.entities[0]).toMatchObject({ type: 'TRACE', handle: 'A1' })
    expect((dxf.entities[0] as TraceEntity).points).toHaveLength(4)
  })
})

describe('TRACE 기본값/선택코드 누락 (D)', () => {
  test('D-01 본문 없음', () => {
    const { entity } = parseBody([])
    expect(entity).toEqual({
      points: [],
      thickness: 0,
      extrusionDirection: { x: 0, y: 0, z: 1 },
    })
  })
  test('D-02 39/210 누락 → 기본값', () => {
    const { entity } = parseBody(CORNERS)
    expect(entity.thickness).toBe(0)
    expect(entity.extrusionDirection).toEqual({ x: 0, y: 0, z: 1 })
  })
  test('D-03 꼭짓점 3개만(13 누락)', () => {
    const { entity } = parseBody(CORNERS.slice(0, 9))
    expect(entity.points).toHaveLength(3)
  })
  test('D-04 기본값 객체가 엔티티 간 공유되지 않음', () => {
    const a = parseBody([]).entity
    const b = parseBody([]).entity
    a.extrusionDirection.z = 99
    a.points.push({ x: 1, y: 1, z: 1 })
    expect(b.extrusionDirection.z).toBe(1)
    expect(b.points).toEqual([])
  })
  test('D-05 parseSync 에서 핸들 없는 TRACE 도 handle 이 채워짐(현재 숫자 타입)', () => {
    const dxf = parseFull([[0, 'TRACE'], [8, '0'], ...CORNERS])
    // ensureHandle 은 공용 카운터(number)를 넣는다 — 타입 선언(string)과 다름. 문서 참고.
    expect(dxf.entities[0].handle).toBeTypeOf('number')
  })
})

describe('TRACE 경계값 (B)', () => {
  test('B-01 0 / 음수 / 매우 큰 값', () => {
    const { entity } = parseBody([
      [39, '-0'], [10, -1e308], [20, 1.7976931348623157e308], [30, 0],
      [11, -5], [21, -5], [31, -5],
    ])
    expect(Object.is(entity.thickness, -0)).toBe(true)
    expect(entity.points[0]).toEqual({ x: -1e308, y: Number.MAX_VALUE, z: 0 })
    expect(entity.points[1]).toEqual({ x: -5, y: -5, z: -5 })
  })
  test('B-02 지수 표기', () => {
    const { entity } = parseBody([[39, '1.5E+02'], [10, '1e-10'], [20, '-2.5E3']])
    expect(entity.thickness).toBe(150)
    expect(entity.points[0]).toEqual({ x: 1e-10, y: -2500 })
  })
  test('B-03 오버플로 값은 Infinity', () => {
    const { entity } = parseBody([[39, '1e999'], [10, '-1e999'], [20, 0]])
    expect(entity.thickness).toBe(Infinity)
    expect(entity.points[0].x).toBe(-Infinity)
  })
  test('B-04 NaN / 숫자 아님 → NaN (크래시 없음)', () => {
    const { entity, scanner } = parseBody([
      [39, 'NaN'], [10, 'abc'], [20, ''], [210, 'x'], [220, 0], [230, 1],
    ])
    expect(entity.thickness).toBeNaN()
    expect(entity.points[0].x).toBeNaN()
    expect(entity.points[0].y).toBeNaN()
    expect(entity.extrusionDirection.x).toBeNaN()
    expect(scanner.next()).toMatchObject({ code: 0, value: 'EOF' })
  })
  test('B-05 숫자 뒤 쓰레기 문자는 parseFloat 규칙으로 앞부분만', () => {
    const { entity } = parseBody([[39, '12.5mm']])
    expect(entity.thickness).toBe(12.5)
  })
  test('B-06 빈 레이어 이름', () => {
    const { entity } = parseBody([[8, '']])
    expect(entity.layer).toBe('')
  })
  test('B-07 한글 / 유니코드 / \\U+ 이스케이프 레이어는 원문 보존', () => {
    expect(parseBody([[8, '가구-평면']]).entity.layer).toBe('가구-평면')
    expect(parseBody([[8, '레이어🙂']]).entity.layer).toBe('레이어🙂')
    expect(parseBody([[8, '\\U+AC00\\U+AD6C']]).entity.layer).toBe(
      '\\U+AC00\\U+AD6C',
    )
  })
  test('B-08 앞뒤 공백 패딩된 숫자', () => {
    const { entity } = parseBody([[' 39', '   2.5   '], ['  10', ' 1 '], ['20', '\t2']])
    expect(entity.thickness).toBe(2.5)
    expect(entity.points[0]).toEqual({ x: 1, y: 2 })
  })
})

describe('TRACE 순서 뒤섞임·중복 (O)', () => {
  test('O-01 꼭짓점 순서 13,12,11,10 → 원문 순서대로 쌓임', () => {
    const { entity } = parseBody([
      [13, 4], [23, 4], [12, 3], [22, 3], [11, 2], [21, 2], [10, 1], [20, 1],
    ])
    expect(entity.points.map((p) => p.x)).toEqual([4, 3, 2, 1])
  })
  test('O-02 210 이 꼭짓점보다 먼저', () => {
    const { entity } = parseBody([[210, 0], [220, 0], [230, -1], ...CORNERS, [39, 3]])
    expect(entity.extrusionDirection).toEqual({ x: 0, y: 0, z: -1 })
    expect(entity.points).toHaveLength(4)
    expect(entity.thickness).toBe(3)
  })
  test('O-03 중복 10 코드 → 모두 points 로 누적 (5개)', () => {
    const { entity } = parseBody([...CORNERS, [10, 99], [20, 99]])
    expect(entity.points).toHaveLength(5)
    expect(entity.points[4]).toEqual({ x: 99, y: 99 })
  })
  test('O-04 중복 39 → 두번째 39 에서 엔티티 종료, 이후 코드 유실(현재 동작)', () => {
    // 단일 스니펫은 한 번 소비되면 pop 되므로 두번째 39 는 미지 코드 취급
    const { entity, scanner } = parseBody([[39, 1], [39, 2], [8, 'AFTER']])
    expect(entity.thickness).toBe(1)
    expect(entity.layer).toBeUndefined()
    expect(scanner.next()).toMatchObject({ code: 39, value: 2 })
  })
  test('O-05 공통 코드(8)가 꼭짓점 뒤에 와도 수용', () => {
    const { entity } = parseBody([...CORNERS, [8, 'LATE']])
    expect(entity.layer).toBe('LATE')
  })
})

describe('TRACE 구조 적대적 (S)', () => {
  test('S-01 점의 y 누락(10 다음 바로 11) → 예외', () => {
    expect(() => parseBody([[10, 1], [11, 2], [21, 2]])).toThrow(/Expected code/)
  })
  test('S-02 0/EOF 직후(본문 없는 TRACE) parseSync', () => {
    const dxf = new DxfParser().parseSync(
      lines([[0, 'SECTION'], [2, 'ENTITIES'], [0, 'TRACE'], [0, 'ENDSEC'], [0, 'EOF']]).join('\n'),
    )
    expect(dxf.entities).toHaveLength(1)
    expect(dxf.entities[0].type).toBe('TRACE')
  })
  test('S-03 TRACE 바로 다음 LINE 을 잃지 않음', () => {
    const dxf = parseFull([...trace(), ...LINE])
    expect(dxf.entities.map((e) => e.type)).toEqual(['TRACE', 'LINE'])
    expect(dxf.entities[1].handle).toBe('B1')
  })
  test('S-04 본문 없는 TRACE 바로 다음 TRACE', () => {
    const dxf = parseFull([[0, 'TRACE'], ...trace()])
    expect(dxf.entities.map((e) => e.type)).toEqual(['TRACE', 'TRACE'])
    expect((dxf.entities[1] as TraceEntity).points).toHaveLength(4)
  })
  test('S-05 알 수 없는 그룹코드 → 이후 코드 무시, 다음 엔티티는 보존(현재 동작)', () => {
    const dxf = parseFull([
      [0, 'TRACE'], [5, 'A1'], [8, 'L'], [10, 1], [20, 1], [1234, 'junk'],
      [39, 7], ...LINE,
    ])
    const t = dxf.entities[0] as TraceEntity
    expect(t.points).toHaveLength(1)
    expect(t.thickness).toBe(0) // 미지 코드 뒤 39 는 유실
    expect(dxf.entities.map((e) => e.type)).toEqual(['TRACE', 'LINE'])
  })
  test('S-06 잘못된 타입 값(62 에 문자열)', () => {
    const { entity } = parseBody([[62, 'red'], ...CORNERS])
    expect(entity.colorIndex).toBeNaN()
    expect(entity.points).toHaveLength(4)
  })
  test('S-07 XDATA 가 섞여도 꼭짓점/다음 엔티티 보존', () => {
    const dxf = parseFull([
      ...trace([[39, 2]]),
      [1001, 'ACAD'], [1000, '문자열'], [1040, 3.5], [1070, 7],
      [1010, 1], [1020, 2], [1030, 3],
      ...LINE,
    ])
    const t = dxf.entities[0] as TraceEntity
    expect(t.thickness).toBe(2)
    expect(t.points).toHaveLength(4)
    expect(t.xdata).toBeDefined()
    expect(t.xdata?.[0]).toMatchObject({ appName: 'ACAD' })
    expect(dxf.entities[1].type).toBe('LINE')
  })
  test('S-08 리액터/확장딕셔너리(102) 가 섞여도 처리', () => {
    const dxf = parseFull([
      [0, 'TRACE'], [5, 'A1'],
      [102, '{ACAD_REACTORS'], [330, 'R1'], [102, '}'],
      [102, '{ACAD_XDICTIONARY'], [360, 'D1'], [102, '}'],
      [330, 'OWN'], [100, 'AcDbEntity'], [8, 'L'], [100, 'AcDbTrace'],
      ...CORNERS,
      ...LINE,
    ])
    const t = dxf.entities[0] as TraceEntity
    expect(t.points).toHaveLength(4)
    expect(t.ownerBlockRecordSoftId).toBe('OWN')
    expect(t.extensions).toBeDefined()
    expect(Object.keys(t.extensions ?? {})).toEqual(
      expect.arrayContaining(['ACAD_REACTORS', 'ACAD_XDICTIONARY']),
    )
    expect(dxf.entities[1].type).toBe('LINE')
  })
  test('S-09 CRLF 줄바꿈', () => {
    const dxf = parseFull([...trace([[39, 1.25]]), ...LINE], '\r\n')
    const t = dxf.entities[0] as TraceEntity
    expect(t.layer).toBe('L')
    expect(t.subclassMarker).toBe('AcDbTrace')
    expect(t.thickness).toBe(1.25)
    expect(dxf.entities.map((e) => e.type)).toEqual(['TRACE', 'LINE'])
  })
  test('S-10 그룹코드 공백 패딩(실도면 형식 "  0")', () => {
    const padded = dxfWithEntities(trace())
      .split('\n')
      .map((l, i) => (i % 2 === 0 ? l.padStart(3, ' ') : l))
      .join('\n')
    const dxf = new DxfParser().parseSync(padded)
    expect(dxf.entities).toHaveLength(1)
    expect((dxf.entities[0] as TraceEntity).points).toHaveLength(4)
  })
  test('S-11 ENDSEC 없이 EOF 로 끝나는 잘린 파일', () => {
    const text = lines([[0, 'SECTION'], [2, 'ENTITIES'], ...trace(), [0, 'EOF']]).join('\n')
    const dxf = new DxfParser().parseSync(text)
    expect(dxf.entities).toHaveLength(1)
    expect((dxf.entities[0] as TraceEntity).points).toHaveLength(4)
  })
  test('S-12 EOF 그룹 없이 끝난 엔티티(직접 파서) → 예외 없이 종료', () => {
    const scanner = new DxfArrayScanner(lines([[0, 'TRACE'], [8, 'L'], [10, 1], [20, 2]]))
    scanner.next()
    const entity = new TraceEntityParser().parseEntity(scanner, scanner.next())
    expect(entity.layer).toBe('L')
    expect(entity.points).toEqual([{ x: 1, y: 2 }])
  })
  test('S-13 999 주석 코드 → 미지 코드와 동일 취급, 다음 엔티티 보존', () => {
    const dxf = parseFull([...trace(), [999, 'comment'], ...LINE])
    expect(dxf.entities.map((e) => e.type)).toEqual(['TRACE', 'LINE'])
  })
  test('S-14 소문자 "trace" 는 지원 엔티티로 인식하지 않음', () => {
    const dxf = parseFull([[0, 'trace'], [8, 'L'], ...CORNERS, ...LINE])
    expect(dxf.entities.map((e) => e.type)).toEqual(['LINE'])
  })
  it.todo('S-15 미지 그룹코드 이후 필드 보존 (스펙상 무시가 바람직하나 전 엔티티 공통 설계)')
})

describe('TRACE 연속·혼합·BLOCKS (M)', () => {
  test('M-01 TRACE 3개 연속', () => {
    const dxf = parseFull([...trace(), ...trace([[39, 2]]), ...trace([[39, 3]])])
    expect(dxf.entities.map((e) => (e as TraceEntity).thickness)).toEqual([0, 2, 3])
  })
  test('M-02 SOLID/TRACE/LINE 혼합', () => {
    const dxf = parseFull([
      [0, 'SOLID'], [5, 'S1'], [8, 'L'], [100, 'AcDbTrace'], ...CORNERS,
      ...trace(),
      ...LINE,
    ])
    expect(dxf.entities.map((e) => e.type)).toEqual(['SOLID', 'TRACE', 'LINE'])
  })
  test('M-03 BLOCKS 내부 TRACE', () => {
    const text = lines([
      [0, 'SECTION'], [2, 'BLOCKS'],
      [0, 'BLOCK'], [5, '20'], [8, '0'], [2, 'BLK'], [70, 0],
      [10, 0], [20, 0], [30, 0], [3, 'BLK'],
      ...trace(),
      ...LINE,
      [0, 'ENDBLK'], [5, '21'], [8, '0'], [100, 'AcDbBlockEnd'],
      [0, 'ENDSEC'],
      [0, 'SECTION'], [2, 'ENTITIES'], ...trace([[39, 9]]), [0, 'ENDSEC'],
      [0, 'EOF'],
    ]).join('\n')
    const dxf = new DxfParser().parseSync(text)
    const blk = dxf.blocks?.BLK
    expect(blk?.entities?.map((e) => e.type)).toEqual(['TRACE', 'LINE'])
    expect(dxf.entities).toHaveLength(1)
    expect((dxf.entities[0] as TraceEntity).thickness).toBe(9)
  })
})

describe('TRACE 회귀 (R)', () => {
  test('R-03 AcDbBlockEnd 없는 ENDBLK 는 이후 섹션을 삼킴(현재 동작, TRACE 무관)', () => {
    const text = lines([
      [0, 'SECTION'], [2, 'BLOCKS'],
      [0, 'BLOCK'], [2, 'BLK'], ...trace(), [0, 'ENDBLK'],
      [0, 'ENDSEC'],
      [0, 'SECTION'], [2, 'ENTITIES'], ...trace(), [0, 'ENDSEC'],
      [0, 'EOF'],
    ]).join(String.fromCharCode(10))
    const dxf = new DxfParser().parseSync(text)
    expect(dxf.blocks?.BLK?.entities?.[0]?.type).toBe('TRACE')
    expect(dxf.entities ?? []).toHaveLength(0)
  })
  test('R-01 SOLID 파싱 결과는 TRACE 추가와 무관', () => {
    const dxf = parseFull([
      [0, 'SOLID'], [5, 'S1'], [8, 'L'], [100, 'AcDbTrace'], [39, 4], ...CORNERS,
    ])
    expect(dxf.entities[0]).toMatchObject({ type: 'SOLID', thickness: 4 })
    expect((dxf.entities[0] as any).points).toHaveLength(4)
  })
  test('R-02 LINE 결과 불변', () => {
    const dxf = parseFull(LINE)
    expect(dxf.entities[0]).toMatchObject({
      type: 'LINE',
      startPoint: { x: 1, y: 2, z: 0 },
      endPoint: { x: 3, y: 4, z: 0 },
    })
  })
})

describe('TRACE 성능 (P)', () => {
  test('P-01 TRACE 20,000개 + LINE 교차 파싱', () => {
    const body: Array<[number | string, string | number]> = []
    for (let i = 0; i < 10000; i++) {
      body.push(...trace([[39, i]]), ...LINE)
      body.push(...trace([[39, -i]]))
    }
    const start = performance.now()
    const dxf = parseFull(body)
    const elapsed = performance.now() - start
    expect(dxf.entities).toHaveLength(30000)
    expect(dxf.entities.filter((e) => e.type === 'TRACE')).toHaveLength(20000)
    expect(elapsed).toBeLessThan(10000)
  })
})
