/**
 * SEQEND 전방위·적대적 테스트. 시나리오 정의는 ./TEST_SCENARIOS.md 참고.
 * 각 describe/test 이름 앞의 ID(N-01, B-03 ...)가 문서의 시나리오 ID 와 1:1 대응한다.
 */
import { describe, test, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { DxfParser } from '../../DxfParser.ts'
import { parseEntities } from '../parser.ts'
import { SeqendEntityParser } from './parser.ts'

type G = (string | number)[]

/** ENTITIES 섹션 본문(그룹 배열)을 parseEntities 로 파싱. ENDSEC/EOF 는 자동으로 붙인다. */
function ents(groups: G, { tail = true }: { tail?: boolean } = {}) {
  const lines = (tail ? [...groups, '0', 'ENDSEC', '0', 'EOF'] : groups).map(String)
  const scanner = new DxfArrayScanner(lines)
  return parseEntities(scanner.next(), scanner) as any[]
}

/** SEQEND 하나만 SeqendEntityParser 로 직접 파싱하고 스캐너 다음 그룹을 함께 돌려준다. */
function single(groups: G) {
  const scanner = new DxfArrayScanner(groups.map(String))
  scanner.next() // 0
  const entity = new SeqendEntityParser().parseEntity(scanner, scanner.next()) as any
  return { entity, next: scanner.next() }
}

/** 전체 파서(DxfParser.parseSync) 경유. */
function full(entitiesBody: G, blocksBody?: G, eol = '\n') {
  const lines: G = []
  if (blocksBody) lines.push('0', 'SECTION', '2', 'BLOCKS', ...blocksBody, '0', 'ENDSEC')
  lines.push('0', 'SECTION', '2', 'ENTITIES', ...entitiesBody, '0', 'ENDSEC', '0', 'EOF')
  return new DxfParser().parseSync(lines.map(String).join(eol) + eol)
}

const LINE = (h: string): G => [
  '0', 'LINE', '5', h, '8', '0', '100', 'AcDbEntity', '100', 'AcDbLine',
  '10', '0', '20', '0', '30', '0', '11', '1', '21', '1', '31', '0',
]
const SEQEND = (h: string, owner = '10', extra: G = []): G => [
  '0', 'SEQEND', '5', h, '330', owner, '100', 'AcDbEntity', '8', '0', ...extra,
]
const POLYLINE = (h: string, nVertices: number): G => {
  const g: G = [
    '0', 'POLYLINE', '5', h, '8', '0', '100', 'AcDbEntity', '100', 'AcDb2dPolyline',
    '66', '1', '10', '0', '20', '0', '30', '0', '70', '0',
  ]
  for (let i = 0; i < nVertices; i++) {
    g.push(
      '0', 'VERTEX', '5', `${h}V${i}`, '330', h, '8', '0', '100', 'AcDbEntity',
      '100', 'AcDbVertex', '100', 'AcDb2dVertex', '10', String(i), '20', String(i), '30', '0',
    )
  }
  return g
}
const INSERT = (h: string): G => [
  '0', 'INSERT', '5', h, '8', '0', '100', 'AcDbEntity', '100', 'AcDbBlockReference',
  '66', '1', '2', 'BLK', '10', '0', '20', '0', '30', '0',
]
const ATTRIB = (h: string, owner: string): G => [
  '0', 'ATTRIB', '5', h, '330', owner, '8', '0', '100', 'AcDbEntity', '100', 'AcDbText',
  '10', '0', '20', '0', '30', '0', '40', '1', '1', 'V', '100', 'AcDbAttribute', '2', 'TAG', '70', '0',
]
const types = (list: any[]) => list.map((e) => e.type)

// ───────────────────────── N: 정상 ─────────────────────────
describe('SEQEND 정상 (N)', () => {
  test('N-01 최소 필수 그룹(5/330/100/8)', () => {
    const [e] = ents(SEQEND('1A', '19F'))
    expect(e).toMatchObject({ type: 'SEQEND', handle: '1A', ownerBlockRecordSoftId: '19F', layer: '0' })
  })

  test('N-02 DXF 레퍼런스 공통 엔티티 그룹 전체', () => {
    const [e] = ents([
      '0', 'SEQEND', '5', '1', '330', '2', '100', 'AcDbEntity', '67', '1', '410', 'Layout1',
      '8', 'A', '6', 'DASHED', '347', 'MAT', '62', '256', '370', '-1', '48', '2.5', '60', '1',
      '92', '0', '420', '255', '430', 'Book$Red', '440', '33554431', '380', '1', '390', 'PS', '284', '3',
    ])
    expect(e).toEqual({
      type: 'SEQEND', handle: '1', ownerBlockRecordSoftId: '2', isInPaperSpace: true,
      layoutTabName: 'Layout1', layer: 'A', lineType: 'DASHED', materialObjectHardId: 'MAT',
      colorIndex: 256, lineweight: -1, lineTypeScale: 2.5, isVisible: true, proxyByte: 0,
      color: 255, colorName: 'Book$Red', transparency: 33554431, plotStyleType: 1,
      plotStyleHardId: 'PS', shadowMode: 3,
    })
  })

  test('N-03 tc0.partial_dxf 를 SeqendEntityParser 로 직접 파싱하고 EOF 앞에서 멈춤', () => {
    const lines = readFileSync(join(__dirname, 'tc0.partial_dxf'), 'utf-8').split('\n')
    const { entity, next } = single(lines)
    expect(entity).toMatchObject({ handle: '1A3', ownerBlockRecordSoftId: '19F', layer: 'WALL' })
    expect(next).toMatchObject({ code: 0, value: 'EOF' })
  })

  test('N-04 두 번째 100 마커는 subclassMarker 로 보존', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '100', 'AcDbEntity', '100', 'AcDbSequenceEnd', '8', 'A'])
    expect(e.subclassMarker).toBe('AcDbSequenceEnd')
    expect(e.layer).toBe('A')
  })

  test('N-05 R12 스타일(100 없이 5/8 만)', () => {
    const [e] = ents(['0', 'SEQEND', '5', '7', '8', 'L'])
    expect(e).toMatchObject({ type: 'SEQEND', handle: '7', layer: 'L' })
  })
})

// ───────────────────────── D: 기본값·누락 ─────────────────────────
describe('SEQEND 기본값/선택코드 누락 (D)', () => {
  test('D-01 그룹 없이 0 SEQEND 만 → 자동 handle 부여, 다른 필드 없음', () => {
    const [e, l] = ents(['0', 'SEQEND', ...LINE('99')])
    expect(e.type).toBe('SEQEND')
    expect(e.handle).toBeDefined() // ensureHandle 이 숫자 카운터 부여(현재 동작)
    expect(e.layer).toBeUndefined()
    expect(e.ownerBlockRecordSoftId).toBeUndefined()
    expect(l.handle).toBe('99')
  })

  test('D-02 330 누락 → ownerBlockRecordSoftId undefined', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '8', '0'])
    expect(e).not.toHaveProperty('ownerBlockRecordSoftId')
  })

  test('D-03 선택 공통코드 없음 → 기본값 주입 안 함(lineTypeScale/isVisible 등 undefined)', () => {
    const [e] = ents(SEQEND('1'))
    for (const k of ['lineTypeScale', 'isVisible', 'colorIndex', 'lineweight', 'color', 'xdata', 'extensions'])
      expect(e[k]).toBeUndefined()
  })
})

// ───────────────────────── B: 경계값 ─────────────────────────
describe('SEQEND 경계값 (B)', () => {
  test('B-01 0 값', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '62', '0', '370', '0', '48', '0', '60', '0', '67', '0'])
    expect(e).toMatchObject({ colorIndex: 0, lineweight: 0, lineTypeScale: 0, isVisible: false, isInPaperSpace: false })
  })

  test('B-02 음수', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '62', '-7', '370', '-3', '48', '-1.5'])
    expect(e).toMatchObject({ colorIndex: -7, lineweight: -3, lineTypeScale: -1.5 })
  })

  test('B-03 매우 큰 값/지수 표기', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '48', '-1E+300', '370', '99999999999', '440', '4294967295'])
    expect(e.lineTypeScale).toBe(-1e300)
    expect(e.lineweight).toBe(99999999999)
    expect(e.transparency).toBe(4294967295)
  })

  test('B-04 정수 코드(62)에 지수 표기 "1e3" → parseInt 로 1 (현재 동작 문서화)', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '62', '1e3'])
    expect(e.colorIndex).toBe(1)
  })

  test('B-05 숫자 코드에 NaN/문자열 → NaN 저장, 크래시 없음, 다음 엔티티 유지', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '62', 'abc', '48', 'NaN', '8', 'A', ...LINE('99')])
    expect(Number.isNaN(list[0].colorIndex)).toBe(true)
    expect(Number.isNaN(list[0].lineTypeScale)).toBe(true)
    expect(list[0].layer).toBe('A')
    expect(list[1].handle).toBe('99')
  })

  test('B-06 48 에 Infinity 문자열', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '48', 'Infinity'])
    expect(e.lineTypeScale).toBe(Infinity)
  })

  test('B-07 빈 문자열 값(handle/layer/owner)', () => {
    const [e, l] = ents(['0', 'SEQEND', '5', '', '330', '', '8', '', ...LINE('99')])
    expect(e.layer).toBe('')
    expect(e.ownerBlockRecordSoftId).toBe('')
    // 빈 handle 은 falsy 라 ensureHandle 이 자동 handle 로 덮어씀(현재 동작)
    expect(e.handle).not.toBe('')
    expect(l.handle).toBe('99')
  })

  test('B-08 유니코드/한글/\\U+ 이스케이프 문자열은 원문 그대로 보존', () => {
    const [e] = ents(['0', 'SEQEND', '5', 'FF', '8', '벽체_레이어', '6', '\\U+B2E8\\U+C120', '410', '배치 1 🧱'])
    expect(e.layer).toBe('벽체_레이어')
    expect(e.lineType).toBe('\\U+B2E8\\U+C120')
    expect(e.layoutTabName).toBe('배치 1 🧱')
  })

  test('B-09 매우 긴 문자열(10만자) 레이어명', () => {
    const big = 'x'.repeat(100_000)
    const [e] = ents(['0', 'SEQEND', '5', '1', '8', big])
    expect(e.layer.length).toBe(100_000)
  })

  test('B-10 handle 대소문자/선행 0 보존', () => {
    const [e] = ents(['0', 'SEQEND', '5', '00aB', '330', '0001F'])
    expect(e.handle).toBe('00aB')
    expect(e.ownerBlockRecordSoftId).toBe('0001F')
  })
})

// ───────────────────────── O: 순서·중복 ─────────────────────────
describe('SEQEND 순서 뒤섞임/중복 (O)', () => {
  test('O-01 그룹 순서 역순이어도 전부 파싱', () => {
    const [e] = ents(['0', 'SEQEND', '8', 'A', '100', 'AcDbEntity', '330', '2', '5', '1'])
    expect(e).toMatchObject({ handle: '1', ownerBlockRecordSoftId: '2', layer: 'A' })
  })

  test('O-02 중복 8 → 첫 값 유지, 이후 그룹은 버리고 다음 엔티티는 유지 (현재 동작)', () => {
    const [e, l] = ents(['0', 'SEQEND', '5', '1', '8', 'A', '8', 'B', '62', '3', ...LINE('99')])
    expect(e.layer).toBe('A')
    expect(e.colorIndex).toBeUndefined() // 중복 뒤 그룹 손실(파서 제너레이터 공통 동작)
    expect(l).toMatchObject({ type: 'LINE', handle: '99' })
  })

  test('O-03 중복 5 → 첫 handle 유지', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '5', '2'])
    expect(e.handle).toBe('1')
  })

  test('O-04 100 마커 3회 → 크래시 없이 앞 두 개만 소비', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '100', 'A', '100', 'B', '100', 'C', ...LINE('99')])
    expect(list[0].subclassMarker).toBe('B')
    expect(types(list)).toEqual(['SEQEND', 'LINE'])
  })

  it.todo('O-05 중복/미지원 그룹 이후의 정상 그룹도 계속 파싱해야 하는가(스펙 미정, 공통 파서 제너레이터 정책)')
})

// ───────────────────────── S: 구조 적대적 ─────────────────────────
describe('SEQEND 구조 적대적 (S)', () => {
  test('S-01 잘린 엔티티: "0 SEQEND" 직후 입력 끝(EOF·ENDSEC 없음)', () => {
    const list = ents(['0', 'SEQEND'], { tail: false })
    expect(types(list)).toEqual(['SEQEND'])
  })

  test('S-02 값 없이 코드만 남은 홀수 줄', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '8'], { tail: false })
    expect(list[0]).toMatchObject({ type: 'SEQEND', handle: '1' })
  })

  test('S-03 SEQEND 직후 EOF', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '0', 'EOF'], { tail: false })
    expect(list).toHaveLength(1)
  })

  test('S-04 0 SEQEND 바로 다음 다른 엔티티', () => {
    const list = ents(['0', 'SEQEND', ...LINE('99'), '0', 'SEQEND', '0', 'SEQEND', ...LINE('98')])
    expect(types(list)).toEqual(['SEQEND', 'LINE', 'SEQEND', 'SEQEND', 'LINE'])
    expect(list.at(-1).handle).toBe('98')
  })

  test('S-05 알 수 없는 그룹코드 → 크래시 없음, 다음 엔티티 유지 (이후 그룹은 손실: 현재 동작)', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '999', 'comment', '1071', '5', '8', 'A', ...LINE('99')])
    expect(list[0].handle).toBe('1')
    expect(list[0].layer).toBeUndefined()
    expect(list[1].handle).toBe('99')
  })

  test('S-06 잘못된 타입 값(60="x", 67="2", 284="z")', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '60', 'x', '67', '2', '284', 'z', ...LINE('99')])
    expect(list[0].isVisible).toBe(false)
    expect(list[0].isInPaperSpace).toBe(true)
    expect(Number.isNaN(list[0].shadowMode)).toBe(true)
    expect(list[1].handle).toBe('99')
  })

  test('S-07 XDATA(1001) 섞임', () => {
    const list = ents([
      ...SEQEND('1', '10', ['1001', 'APP', '1000', 'v', '1070', '3', '1001', 'APP2', '1040', '1.5']),
      ...LINE('99'),
    ])
    expect(list[0].xdata).toEqual([
      { appName: 'APP', value: ['v', 3] },
      { appName: 'APP2', value: [1.5] },
    ])
    expect(list[1].handle).toBe('99')
  })

  test('S-08 리액터/확장딕셔너리(102 그룹) 섞임', () => {
    const [e, l] = ents([
      '0', 'SEQEND', '5', '1', '102', '{ACAD_REACTORS', '330', '2', '102', '}',
      '102', '{ACAD_XDICTIONARY', '360', '3', '102', '}', '330', '4', '100', 'AcDbEntity', '8', 'A',
      ...LINE('99'),
    ])
    expect(e.extensions).toEqual({
      ACAD_REACTORS: [{ code: 330, value: '2' }],
      ACAD_XDICTIONARY: [{ code: 360, value: '3' }],
    })
    expect(e.ownerBlockRecordSoftId).toBe('4')
    expect(e.layer).toBe('A')
    expect(l.handle).toBe('99')
  })

  test('S-09 닫히지 않은 102 블록 → 크래시 없음', () => {
    expect(() => ents(['0', 'SEQEND', '5', '1', '102', '{ACAD_REACTORS', '330', '2', ...LINE('99')])).not.toThrow()
  })

  test('S-10 CRLF 줄바꿈(parseSync)', () => {
    const dxf = full([...POLYLINE('10', 1), ...SEQEND('13'), ...LINE('99')], undefined, '\r\n')
    expect(types(dxf.entities)).toEqual(['POLYLINE', 'SEQEND', 'LINE'])
    expect(dxf.entities[1]).toMatchObject({ handle: '13', layer: '0' })
  })

  test('S-11 그룹코드 공백 패딩("  8", "330 ")', () => {
    const [e] = ents(['  0', 'SEQEND', '  5', '1', '330 ', '2', '  8', 'A'])
    expect(e).toMatchObject({ type: 'SEQEND', handle: '1', ownerBlockRecordSoftId: '2', layer: 'A' })
  })

  test('S-12 문자열 값의 앞뒤 공백은 보존', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '8', '  A  '])
    expect(e.layer).toBe('  A  ')
  })

  test('S-13 엔티티 이름 대소문자 다름("seqend") → 미지원으로 건너뜀', () => {
    const list = ents(['0', 'seqend', '5', '1', ...LINE('99')])
    expect(types(list)).toEqual(['LINE'])
  })

  test('S-14 프로토타입 오염 시도 값은 단순 문자열', () => {
    const [e] = ents(['0', 'SEQEND', '5', '__proto__', '8', 'constructor'])
    expect(e.handle).toBe('__proto__')
    expect(({} as any).polluted).toBeUndefined()
  })
})

// ───────────────────────── C: 연속·혼합·BLOCKS ─────────────────────────
describe('SEQEND 연속/혼합/BLOCKS (C)', () => {
  test('C-01 POLYLINE→SEQEND→INSERT→ATTRIB→SEQEND→LINE 혼합', () => {
    const list = ents([
      ...POLYLINE('10', 3), ...SEQEND('13', '10'),
      ...INSERT('20'), ...ATTRIB('21', '20'), ...ATTRIB('22', '20'), ...SEQEND('23', '20'),
      ...LINE('99'),
    ])
    expect(types(list)).toEqual(['POLYLINE', 'SEQEND', 'INSERT', 'ATTRIB', 'ATTRIB', 'SEQEND', 'LINE'])
    expect(list[0].vertices).toHaveLength(3)
    expect(list[1].ownerBlockRecordSoftId).toBe('10')
    expect(list[5].ownerBlockRecordSoftId).toBe('20')
  })

  test('C-02 SEQEND 연속 100개', () => {
    const g: G = []
    for (let i = 0; i < 100; i++) g.push(...SEQEND(`S${i}`))
    const list = ents([...g, ...LINE('99')])
    expect(list).toHaveLength(101)
    expect(list.slice(0, 100).map((e) => e.handle)).toEqual(Array.from({ length: 100 }, (_, i) => `S${i}`))
  })

  test('C-03 BLOCKS 내부 POLYLINE/SEQEND 후 ENDBLK (parseSync)', () => {
    const dxf = full(LINE('99'), [
      '0', 'BLOCK', '5', 'B1', '8', '0', '2', 'BLK', '70', '0', '10', '0', '20', '0', '30', '0',
      ...POLYLINE('30', 2), ...SEQEND('33', '30'),
      '0', 'ENDBLK', '5', 'B2', '8', '0', '100', 'AcDbEntity', '100', 'AcDbBlockEnd',
    ])
    const blk = (dxf.blocks as any).BLK
    expect(types(blk.entities)).toEqual(['POLYLINE', 'SEQEND'])
    expect(blk.entities[1]).toMatchObject({ handle: '33', ownerBlockRecordSoftId: '30' })
    expect(types(dxf.entities)).toEqual(['LINE'])
  })

  test('C-04 BLOCKS 내부 SEQEND 가 마지막(ENDBLK 바로 앞, 필드 없음)', () => {
    const dxf = full([], [
      '0', 'BLOCK', '5', 'B1', '8', '0', '2', 'B2', '70', '0', '10', '0', '20', '0', '30', '0',
      '0', 'SEQEND', '0', 'ENDBLK', '5', 'B3', '100', 'AcDbBlockEnd',
      '0', 'BLOCK', '5', 'B4', '8', '0', '2', 'B5', '70', '0', '10', '0', '20', '0', '30', '0',
      ...LINE('98'), '0', 'ENDBLK', '100', 'AcDbBlockEnd',
    ])
    expect(types((dxf.blocks as any).B2.entities)).toEqual(['SEQEND'])
    expect(types((dxf.blocks as any).B5.entities)).toEqual(['LINE'])
  })

  test('C-05 parseSync 엔티티 섹션 전체 경유', () => {
    const dxf = full([...INSERT('20'), ...ATTRIB('21', '20'), ...SEQEND('22', '20'), ...LINE('99')])
    expect(types(dxf.entities)).toEqual(['INSERT', 'ATTRIB', 'SEQEND', 'LINE'])
  })
})

// ───────────────────────── P: 시퀀스 짝 불일치 ─────────────────────────
describe('SEQEND 시퀀스 짝 불일치 (P)', () => {
  test('P-01 SEQEND 단독(앞에 POLYLINE/INSERT 없음)', () => {
    const list = ents([...LINE('98'), ...SEQEND('1', 'DEAD'), ...LINE('99')])
    expect(types(list)).toEqual(['LINE', 'SEQEND', 'LINE'])
    expect(list[1].ownerBlockRecordSoftId).toBe('DEAD')
  })

  test('P-02 POLYLINE 뒤 SEQEND 누락 → 다음 엔티티에서 vertex 목록 종료', () => {
    const list = ents([...POLYLINE('10', 2), ...LINE('99')])
    expect(types(list)).toEqual(['POLYLINE', 'LINE'])
    expect(list[0].vertices).toHaveLength(2)
  })

  test('P-03 VERTEX 0개 POLYLINE + SEQEND', () => {
    const list = ents([...POLYLINE('10', 0), ...SEQEND('11', '10'), ...LINE('99')])
    expect(types(list)).toEqual(['POLYLINE', 'SEQEND', 'LINE'])
    expect(list[0].vertices).toHaveLength(0)
  })

  test('P-04 INSERT(66=1) 뒤 ATTRIB 없이 바로 SEQEND', () => {
    const list = ents([...INSERT('20'), ...SEQEND('21', '20'), ...LINE('99')])
    expect(types(list)).toEqual(['INSERT', 'SEQEND', 'LINE'])
  })

  test('P-05 INSERT ATTRIB 뒤 SEQEND 누락', () => {
    const list = ents([...INSERT('20'), ...ATTRIB('21', '20'), ...LINE('99')])
    expect(types(list)).toEqual(['INSERT', 'ATTRIB', 'LINE'])
  })

  test('P-06 SEQEND 중복(한 시퀀스에 두 번)', () => {
    const list = ents([...POLYLINE('10', 1), ...SEQEND('11', '10'), ...SEQEND('12', '10'), ...LINE('99')])
    expect(types(list)).toEqual(['POLYLINE', 'SEQEND', 'SEQEND', 'LINE'])
  })

  test('P-07 SEQEND 뒤 고아 VERTEX → VERTEX 는 단독 엔티티로 처리(또는 무시)되어도 LINE 유지', () => {
    const list = ents([
      ...POLYLINE('10', 1), ...SEQEND('11', '10'),
      '0', 'VERTEX', '5', 'V9', '8', '0', '10', '5', '20', '5', '30', '0',
      ...LINE('99'),
    ])
    expect(list[0].vertices).toHaveLength(1)
    expect(list.at(-1).handle).toBe('99')
  })

  test('P-08 owner(330)가 실제 POLYLINE handle 과 불일치 → 값 그대로 보존(검증 안 함)', () => {
    const list = ents([...POLYLINE('10', 1), ...SEQEND('11', 'FFFF')])
    expect(list[1].ownerBlockRecordSoftId).toBe('FFFF')
  })
})

// ───────────────────────── R: 회귀 ─────────────────────────
describe('SEQEND 회귀 (R)', () => {
  test('R-01 SEQEND 앞뒤 엔티티의 필드가 오염되지 않음', () => {
    const list = ents([...LINE('98'), ...SEQEND('1', '10', ['62', '5', '1001', 'APP', '1000', 'x']), ...LINE('99')])
    expect(list[0]).not.toHaveProperty('colorIndex')
    expect(list[2]).not.toHaveProperty('xdata')
    expect(list[2].endPoint).toEqual({ x: 1, y: 1, z: 0 })
  })

  test('R-02 파서 인스턴스 재사용 시 상태 누수 없음', () => {
    const p = new SeqendEntityParser()
    const s1 = new DxfArrayScanner(['8', 'A', '62', '1', '0', 'EOF'])
    const s2 = new DxfArrayScanner(['8', 'B', '0', 'EOF'])
    const a = p.parseEntity(s1, s1.next()) as any
    const b = p.parseEntity(s2, s2.next()) as any
    expect(a).toMatchObject({ layer: 'A', colorIndex: 1 })
    expect(b).toEqual({ layer: 'B' })
  })

  test('R-03 SEQEND 를 생략한 POLYLINE 과 포함한 POLYLINE 의 vertex 결과 동일', () => {
    const a = ents([...POLYLINE('10', 4), ...SEQEND('11'), ...LINE('99')])
    const b = ents([...POLYLINE('10', 4), ...LINE('99')])
    expect(a[0].vertices).toEqual(b[0].vertices)
  })
})

// ───────────────────────── F: 성능 ─────────────────────────
describe('SEQEND 성능 (F)', () => {
  test('F-01 POLYLINE+VERTEX×3+SEQEND 2만 세트를 2초 내 파싱', () => {
    const g: G = []
    for (let i = 0; i < 20_000; i++) g.push(...POLYLINE(`P${i}`, 3), ...SEQEND(`S${i}`, `P${i}`))
    const t0 = performance.now()
    const list = ents(g)
    const ms = performance.now() - t0
    expect(list).toHaveLength(40_000)
    expect(list.filter((e) => e.type === 'SEQEND')).toHaveLength(20_000)
    expect(ms).toBeLessThan(2000)
  })
})

// ───────────────────────── X: 기타 문서화 ─────────────────────────
describe('SEQEND 기타 (X)', () => {
  it.todo('X-01 R12 형식 ENDBLK(100 AcDbBlockEnd 없음) 뒤 블록/섹션이 소비되는 문제 — BLOCKS 파서 영역, SEQEND 범위 밖')
})

// ───────────────────────── RW: 실도면 기반 ─────────────────────────
const REAL_ROOT = process.env.SEQEND_DXF_ROOT ?? 'D:\CADView_도면'
function findRealSeqendFile(): string | undefined {
  if (!existsSync(REAL_ROOT)) return undefined
  const stack = [REAL_ROOT]
  while (stack.length) {
    const dir = stack.pop()!
    let names: string[] = []
    try { names = readdirSync(dir) } catch { continue }
    for (const n of names) {
      const p = join(dir, n)
      let st
      try { st = statSync(p) } catch { continue }
      if (st.isDirectory()) stack.push(p)
      else if (/\.dxf$/i.test(n) && st.size < 20 * 1024 * 1024) {
        const t = readFileSync(p, 'latin1')
        if (/\r?\nSEQEND\r?\n/.test(t)) return p
      }
    }
  }
  return undefined
}
const realFile = findRealSeqendFile()

describe('SEQEND 실도면 (RW)', () => {
  test.skipIf(!realFile)('RW-01 실도면 SEQEND 원문 개수 = 파싱 개수(엔티티+블록)', () => {
    const text = readFileSync(realFile!, 'utf-8')
    const lines = text.split(/\r\n|\r|\n/)
    let raw = 0
    for (let i = 0; i + 1 < lines.length; i += 2)
      if (lines[i].trim() === '0' && lines[i + 1].trim() === 'SEQEND') raw++
    const dxf = new DxfParser().parseSync(text)
    const all = [
      ...dxf.entities,
      ...Object.values(dxf.blocks as Record<string, any>).flatMap((b) => b.entities ?? []),
    ] as any[]
    const parsed = all.filter((e) => e.type === 'SEQEND')
    expect(parsed.length).toBe(raw)
    for (const e of parsed) expect(typeof e.handle).toBe('string')
  }, 60_000)
})
