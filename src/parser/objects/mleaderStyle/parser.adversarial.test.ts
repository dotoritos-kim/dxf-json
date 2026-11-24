/**
 * MLEADERSTYLE 적대적/경계/회귀 테스트.
 * 시나리오 정의는 같은 폴더의 TEST_SCENARIOS.md 를 따른다 (테스트 이름 앞의 ID 와 일치).
 */
import { describe, expect, it } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { DxfParser } from '../../DxfParser.ts'
import { parseObjects } from '../parser.ts'
import type { MLeaderStyleDXFObject } from './types.ts'

type Pair = [number | string, string | number]

/** code/value 쌍을 DXF 라인 배열로 만든다. */
function lines(pairs: Pair[]): string[] {
  return pairs.flatMap(([c, v]) => [String(c), String(v)])
}

/** OBJECTS 섹션 내부(ENDSEC/EOF 자동 추가)를 parseObjects 로 직접 파싱. */
function parseObj(pairs: Pair[]) {
  const content = lines([...pairs, [0, 'ENDSEC'], [0, 'EOF']])
  const scanner = new DxfArrayScanner(content)
  return parseObjects(scanner.next(), scanner)
}

function styles(pairs: Pair[]): MLeaderStyleDXFObject[] {
  return (parseObj(pairs).byName.MLEADERSTYLE ?? []) as MLeaderStyleDXFObject[]
}

/** 섹션 배열로 완전한 DXF 텍스트를 만든다. */
function dxf(sections: Record<string, Pair[]>, eol = '\n'): string {
  const out: string[] = []
  const add = ([c, v]: Pair) => out.push(String(c), String(v))
  for (const [name, body] of Object.entries(sections)) {
    add([0, 'SECTION'])
    add([2, name])
    for (const p of body) add(p)
    add([0, 'ENDSEC'])
  }
  add([0, 'EOF'])
  return out.join(eol)
}

const head = (handle = '1A'): Pair[] => [
  [0, 'MLEADERSTYLE'],
  [5, handle],
  [330, 'C'],
  [100, 'AcDbMLeaderStyle'],
]

/** DXF 레퍼런스(AcDbMLeaderStyle) 의 모든 그룹 코드 */
const FULL: Pair[] = [
  ...head('100'),
  [179, 2],
  [170, 2],
  [171, 1],
  [172, 0],
  [90, 2],
  [40, 0.25],
  [41, 0.5],
  [173, 1],
  [91, -1056964608],
  [340, '14'],
  [92, -2],
  [290, 1],
  [42, 2.0],
  [291, 1],
  [43, 8.0],
  [3, 'Standard'],
  [341, '11'],
  [44, 4.0],
  [300, 'Default text'],
  [342, '15'],
  [174, 1],
  [175, 2],
  [176, 0],
  [178, 6],
  [93, 256],
  [45, 4.0],
  [292, 0],
  [297, 1],
  [46, 4.0],
  [343, '16'],
  [94, 63],
  [47, 1.0],
  [49, 1.5],
  [140, 2.0],
  [293, 1],
  [141, 0.75],
  [294, 1],
  [177, 0],
  [142, 1.0],
  [295, 0],
  [296, 1],
  [143, 3.75],
  [271, 0],
  [272, 9],
  [273, 10],
  [298, 1],
]

const FULL_EXPECTED = {
  name: 'MLEADERSTYLE',
  handle: '100',
  ownerObjectId: 'C',
  subclassMarker: 'AcDbMLeaderStyle',
  unknown1: 2,
  contentType: 2,
  drawMLeaderOrderType: 1,
  drawLeaderOrderType: 0,
  maxLeaderSegmentPoints: 2,
  firstSegmentAngleConstraint: 0.25,
  secondSegmentAngleConstraint: 0.5,
  leaderLineType: 1,
  leaderLineColor: -1056964608,
  leaderLineTypeId: '14',
  leaderLineWeight: -2,
  landingEnabled: true,
  landingGap: 2,
  doglegEnabled: true,
  doglegLength: 8,
  description: 'Standard',
  arrowheadId: '11',
  arrowheadSize: 4,
  defaultMTextContents: 'Default text',
  textStyleId: '15',
  textLeftAttachmentType: 1,
  textAngleType: 2,
  textAlignmentType: 0,
  textRightAttachmentType: 6,
  textColor: 256,
  textHeight: 4,
  textFrameEnabled: false,
  textAlignAlwaysLeft: true,
  alignSpace: 4,
  blockContentId: '16',
  blockContentColor: 63,
  blockContentScale: { x: 1, y: 1.5, z: 2 },
  blockContentScaleEnabled: true,
  blockContentRotation: 0.75,
  blockContentRotationEnabled: true,
  blockContentConnectionType: 0,
  scale: 1,
  overwritePropertyValue: false,
  annotative: true,
  breakGapSize: 3.75,
  textAttachmentDirection: 0,
  bottomTextAttachmentDirection: 9,
  topTextAttachmentDirection: 10,
  unknown2: true,
}

describe('MLEADERSTYLE 정상 (N)', () => {
  it('N-01 레퍼런스 전 그룹코드를 모두 파싱', () => {
    const [s] = styles(FULL)
    expect(s).toEqual(FULL_EXPECTED)
  })

  it('N-02 DxfParser.parseSync 경유로도 동일하게 파싱', () => {
    const d = new DxfParser().parseSync(dxf({ OBJECTS: FULL }))
    expect(d.objects.byName.MLEADERSTYLE[0]).toEqual(FULL_EXPECTED)
  })

  it('N-03 숫자 필드 타입: 정수 코드는 정수, 실수 코드는 실수, 29x 는 boolean, 핸들은 문자열', () => {
    const [s] = styles(FULL)
    expect(Number.isInteger(s.contentType)).toBe(true)
    expect(typeof s.landingGap).toBe('number')
    expect(typeof s.landingEnabled).toBe('boolean')
    expect(typeof s.textStyleId).toBe('string')
  })
})

describe('MLEADERSTYLE 기본값/선택 코드 누락 (D)', () => {
  it('D-01 헤더만 있는 최소 객체', () => {
    const [s] = styles(head('1'))
    expect(s).toEqual({
      name: 'MLEADERSTYLE',
      handle: '1',
      ownerObjectId: 'C',
      subclassMarker: 'AcDbMLeaderStyle',
    })
  })

  it('D-02 0 MLEADERSTYLE 만 있고 그룹이 하나도 없으면 결과에서 제외', () => {
    const r = parseObj([[0, 'MLEADERSTYLE']])
    expect(r.byName.MLEADERSTYLE).toBeUndefined()
  })

  it('D-03 선택 핸들(340/341/343) 누락 시 undefined', () => {
    const [s] = styles(FULL.filter(([c]) => ![340, 341, 343].includes(c as number)))
    expect(s.leaderLineTypeId).toBeUndefined()
    expect(s.arrowheadId).toBeUndefined()
    expect(s.blockContentId).toBeUndefined()
    expect(s.textStyleId).toBe('15')
  })

  it('D-04 블록 스케일 일부(49 만) 누락 시 나머지 축만 채워짐', () => {
    const [s] = styles([...head(), [47, 2], [140, 3]])
    expect(s.blockContentScale).toEqual({ x: 2, z: 3 })
  })

  it('D-05 기본값을 주입하지 않음 (누락 필드는 키 자체가 없음)', () => {
    const [s] = styles(head())
    expect('scale' in s).toBe(false)
    expect('blockContentScale' in s).toBe(false)
  })

  it('D-06 핸들/서브클래스 없이 값만 있어도 파싱', () => {
    const [s] = styles([[0, 'MLEADERSTYLE'], [3, 'NoHandle']])
    expect(s).toEqual({ name: 'MLEADERSTYLE', description: 'NoHandle' })
  })
})

describe('MLEADERSTYLE 경계값 (B)', () => {
  it('B-01 0 값', () => {
    const [s] = styles([...head(), [42, 0], [45, 0], [142, 0], [90, 0]])
    expect(s).toMatchObject({ landingGap: 0, textHeight: 0, scale: 0, maxLeaderSegmentPoints: 0 })
  })

  it('B-02 음수 값은 그대로 보존 (검증하지 않음)', () => {
    const [s] = styles([...head(), [45, -2.5], [142, -1], [90, -3], [93, -1056964608]])
    expect(s).toMatchObject({ textHeight: -2.5, scale: -1, maxLeaderSegmentPoints: -3, textColor: -1056964608 })
  })

  it('B-03 매우 큰 값 / 32bit 경계 정수', () => {
    const [s] = styles([...head(), [43, '1e308'], [44, '1.7976931348623157E+308'], [91, 2147483647], [92, -2147483648]])
    expect(s.doglegLength).toBe(1e308)
    expect(s.arrowheadSize).toBe(Number.MAX_VALUE)
    expect(s.leaderLineColor).toBe(2147483647)
    expect(s.leaderLineWeight).toBe(-2147483648)
  })

  it('B-04 오버플로(1e999) 는 Infinity', () => {
    const [s] = styles([...head(), [43, '1e999']])
    expect(s.doglegLength).toBe(Infinity)
  })

  it('B-05 지수 표기 실수', () => {
    const [s] = styles([...head(), [40, '1.5E-3'], [41, '2e+2'], [143, '-3.0e1']])
    expect(s).toMatchObject({ firstSegmentAngleConstraint: 0.0015, secondSegmentAngleConstraint: 200, breakGapSize: -30 })
  })

  it('B-06 숫자 아닌 실수/정수 값은 NaN (크래시 없음)', () => {
    const [s] = styles([...head(), [42, 'abc'], [170, 'x'], [45, '']])
    expect(s.landingGap).toBeNaN()
    expect(s.contentType).toBeNaN()
    expect(s.textHeight).toBeNaN()
  })

  it('B-07 "NaN" 문자열 값은 NaN', () => {
    const [s] = styles([...head(), [42, 'NaN']])
    expect(s.landingGap).toBeNaN()
  })

  it('B-08 정수 코드에 실수 값은 parseInt 로 절삭', () => {
    const [s] = styles([...head(), [170, '2.9'], [90, '1e3']])
    expect(s.contentType).toBe(2)
    expect(s.maxLeaderSegmentPoints).toBe(1)
  })

  it('B-09 빈 문자열 description/MText/핸들', () => {
    const [s] = styles([...head(), [3, ''], [300, ''], [342, '']])
    expect(s).toMatchObject({ description: '', defaultMTextContents: '', textStyleId: '' })
  })

  it('B-10 한글/유니코드/이모지 description', () => {
    const [s] = styles([...head(), [3, '표준 스타일 — 漢字 ✓ 😀'], [300, '기본\\P문자']])
    expect(s.description).toBe('표준 스타일 — 漢字 ✓ 😀')
    expect(s.defaultMTextContents).toBe('기본\\P문자')
  })

  it('B-11 \\U+ 이스케이프는 디코딩하지 않고 원문 보존', () => {
    const [s] = styles([...head(), [3, '\\U+D55C\\U+AE00']])
    expect(s.description).toBe('\\U+D55C\\U+AE00')
  })

  it('B-12 문자열 앞뒤 공백 보존(트림 안 함)', () => {
    const [s] = styles([...head(), [3, '  Spaced  ']])
    expect(s.description).toBe('  Spaced  ')
  })

  it('B-13 boolean 코드 0/1 이외 값은 TypeError (스캐너 정책, 현재 동작 문서화)', () => {
    expect(() => styles([...head(), [290, '2']])).toThrow(TypeError)
    expect(() => styles([...head(), [296, 'true']])).toThrow(TypeError)
  })

  it('B-14 boolean 코드 값 앞뒤 공백은 허용', () => {
    const [s] = styles([...head(), [290, ' 1 '], [291, '0 ']])
    expect(s).toMatchObject({ landingEnabled: true, doglegEnabled: false })
  })
})

describe('MLEADERSTYLE 순서/중복 (O)', () => {
  it('O-01 레퍼런스 순서를 뒤섞어도 모든 필드 파싱', () => {
    const body = FULL.slice(4)
    const shuffled = [...body].reverse()
    const [s] = styles([...head('100'), ...shuffled])
    expect(s).toEqual(FULL_EXPECTED)
  })

  it('O-02 공통 헤더(5/330/100) 가 본문 뒤에 와도 파싱', () => {
    const [s] = styles([[0, 'MLEADERSTYLE'], [3, 'Late'], [100, 'AcDbMLeaderStyle'], [5, 'FF'], [330, '1']])
    expect(s).toMatchObject({ handle: 'FF', ownerObjectId: '1', description: 'Late' })
  })

  it('O-03 중복 그룹코드: 첫 값만 취하고 이후 그룹은 버림 (현재 동작 문서화)', () => {
    const [s] = styles([...head(), [3, 'First'], [3, 'Second'], [45, 2.5]])
    expect(s.description).toBe('First')
    // 중복 코드에서 파서가 멈추므로 그 뒤 필드는 유실된다.
    expect(s.textHeight).toBeUndefined()
  })

  it('O-04 중복 뒤에도 다음 객체는 잃지 않음', () => {
    const r = styles([...head('A'), [3, 'a'], [3, 'b'], ...head('B'), [3, 'c']])
    expect(r.map((s) => s.handle)).toEqual(['A', 'B'])
    expect(r[1].description).toBe('c')
  })

  it.todo('O-05 중복 그룹코드 시 마지막 값 우선(last-wins) 정책 여부 — 스펙 미정의')
})

describe('MLEADERSTYLE 구조 적대적 (S)', () => {
  it('S-01 잘린 객체(ENDSEC 직전 종료)', () => {
    const [s] = styles([...head(), [170, 2]])
    expect(s).toMatchObject({ handle: '1A', contentType: 2 })
  })

  it('S-02 EOF 없이 입력이 끝나면 parseSync 가 명시적 오류를 던짐 (현재 동작 문서화)', () => {
    const text = lines([[0, 'SECTION'], [2, 'OBJECTS'], ...head(), [3, 'Trunc']]).join('\n')
    expect(() => new DxfParser().parseSync(text)).toThrow(/Unexpected end of input/)
  })

  it('S-03 값 줄이 빠진 홀수 라인 입력도 크래시 대신 명시적 오류', () => {
    const text = [...lines([[0, 'SECTION'], [2, 'OBJECTS'], ...head()]), '3'].join('\n')
    expect(() => new DxfParser().parseSync(text)).toThrow()
  })

  it('S-04 객체 직후 EOF (ENDSEC 없음)', () => {
    const content = lines([...head(), [3, 'X'], [0, 'EOF']])
    const scanner = new DxfArrayScanner(content)
    const r = parseObjects(scanner.next(), scanner)
    expect(r.byName.MLEADERSTYLE[0]).toMatchObject({ description: 'X' })
  })

  it('S-04b parseSync: OBJECTS 의 ENDSEC 가 빠진 채 EOF 로 끝나도 파싱', () => {
    const text = lines([[0, 'SECTION'], [2, 'OBJECTS'], ...head('E1'), [3, 'NoEndsec'], [0, 'EOF']]).join('\n')
    const d = new DxfParser().parseSync(text)
    expect(d.objects.byName.MLEADERSTYLE[0]).toMatchObject({ handle: 'E1', description: 'NoEndsec' })
  })

  it('S-05 0 바로 다음 다른 객체(MLINESTYLE/DICTIONARY) 를 잃지 않음', () => {
    const r = parseObj([
      ...head('A'),
      [0, 'MLINESTYLE'],
      [5, 'B'],
      [2, 'STD'],
      [0, 'MLEADERSTYLE'],
      [5, 'C'],
      [0, 'DICTIONARY'],
      [5, 'D'],
      [3, 'k'],
      [350, 'E'],
    ])
    expect(r.byName.MLEADERSTYLE.map((o: any) => o.handle)).toEqual(['A', 'C'])
    expect(r.byName.MLINESTYLE[0]).toMatchObject({ handle: 'B', styleName: 'STD' })
    expect(r.byName.DICTIONARY[0]).toMatchObject({ handle: 'D' })
  })

  it('S-06 알 수 없는 그룹코드: 그 앞 필드는 유지, 뒤 필드는 유실 (현재 동작 문서화)', () => {
    const [s] = styles([...head(), [170, 2], [999, 'comment'], [45, 2.5]])
    expect(s.contentType).toBe(2)
    expect(s.textHeight).toBeUndefined()
  })

  it('S-07 알 수 없는 그룹코드 뒤에도 다음 객체는 잃지 않음', () => {
    const r = styles([...head('A'), [7777, 'zzz'], [3, 'lost'], ...head('B'), [3, 'kept']])
    expect(r.map((s) => s.handle)).toEqual(['A', 'B'])
    expect(r[1].description).toBe('kept')
  })

  it.todo('S-08 알 수 없는 그룹코드를 건너뛰고 이후 필드 계속 파싱할지 — 다른 객체 파서와 공통 정책 결정 필요')

  it('S-09 잘못된 타입 값(핸들 자리에 숫자, 정수 자리에 문자열)', () => {
    const [s] = styles([...head(), [340, 12345], [174, 'left']])
    expect(s.leaderLineTypeId).toBe('12345')
    expect(s.textLeftAttachmentType).toBeNaN()
  })

  it('S-10 XDATA 가 여러 앱 / 여러 값', () => {
    const [s] = styles([
      ...head(),
      [3, 'Std'],
      [1001, 'ACAD_MLEADERVER'],
      [1070, 2],
      [1001, 'MYAPP'],
      [1000, '텍스트'],
      [1040, 1.5],
    ])
    expect(s.description).toBe('Std')
    expect(s.xdata).toEqual([
      { appName: 'ACAD_MLEADERVER', value: [2] },
      { appName: 'MYAPP', value: ['텍스트', 1.5] },
    ])
  })

  it('S-11 XDATA 뒤에 이어진 다음 객체를 잃지 않음', () => {
    const r = styles([...head('A'), [1001, 'ACAD_MLEADERVER'], [1070, 2], ...head('B')])
    expect(r.map((s) => s.handle)).toEqual(['A', 'B'])
  })

  it('S-12 리액터 + 확장딕셔너리 + 사용자 102 그룹', () => {
    const [s] = styles([
      [0, 'MLEADERSTYLE'],
      [5, 'A'],
      [102, '{ACAD_XDICTIONARY'],
      [360, 'X1'],
      [102, '}'],
      [102, '{ACAD_REACTORS'],
      [330, 'R1'],
      [330, 'R2'],
      [102, '}'],
      [330, 'OWN'],
      [100, 'AcDbMLeaderStyle'],
      [3, 'S'],
    ])
    expect(s.extensions).toEqual({
      ACAD_XDICTIONARY: [{ code: 360, value: 'X1' }],
      ACAD_REACTORS: [
        { code: 330, value: 'R1' },
        { code: 330, value: 'R2' },
      ],
    })
    expect(s.ownerObjectId).toBe('OWN')
    expect(s.description).toBe('S')
  })

  it('S-13 CRLF 줄바꿈 + 코드/숫자 공백 패딩 (parseSync)', () => {
    const body: Pair[] = [
      [0, 'MLEADERSTYLE'],
      ['  5', '2B'],
      [' 100', 'AcDbMLeaderStyle'],
      ['170', ' 2 '],
      [' 45', '  0.18  '],
      ['290', '1'],
      ['  3', 'Pad'],
    ]
    const d = new DxfParser().parseSync(dxf({ OBJECTS: body }, '\r\n'))
    expect(d.objects.byName.MLEADERSTYLE[0]).toMatchObject({
      handle: '2B',
      contentType: 2,
      textHeight: 0.18,
      landingEnabled: true,
      description: 'Pad',
    })
  })

  it('S-14 BOM 으로 시작하는 파일', () => {
    const d = new DxfParser().parseSync('﻿' + dxf({ OBJECTS: head('B0') }))
    expect(d.objects.byName.MLEADERSTYLE[0].handle).toBe('B0')
  })

  it('S-15 소문자 "mleaderstyle" 은 다른 객체로 취급(무시)', () => {
    const r = parseObj([[0, 'mleaderstyle'], [5, 'A'], ...head('B')])
    expect(r.byName.MLEADERSTYLE.map((o: any) => o.handle)).toEqual(['B'])
  })
})

describe('MLEADERSTYLE 연속/혼합/BLOCKS (M)', () => {
  it('M-01 여러 개 연속 (Standard/Annotative/사용자)', () => {
    const r = styles([
      ...head('A'), [3, 'Standard'],
      ...head('B'), [3, 'Annotative'], [296, 1],
      ...head('C'), [3, '사용자'],
    ])
    expect(r.map((s) => s.description)).toEqual(['Standard', 'Annotative', '사용자'])
    expect(r[1].annotative).toBe(true)
  })

  it('M-02 DICTIONARY(ACAD_MLEADERSTYLE) 와 함께 있는 실도면 구조', () => {
    const d = new DxfParser().parseSync(
      dxf({
        OBJECTS: [
          [0, 'DICTIONARY'], [5, 'D1'], [330, '0'], [100, 'AcDbDictionary'],
          [3, 'Annotative'], [350, 'A'], [3, 'Standard'], [350, 'B'],
          ...head('A'), [3, 'Annotative'],
          ...head('B'), [3, 'Standard'],
        ],
      }),
    )
    expect(d.objects.byName.MLEADERSTYLE).toHaveLength(2)
    expect(d.objects.byName.DICTIONARY).toHaveLength(1)
  })

  it('M-03 BLOCKS / ENTITIES 안의 "MLEADERSTYLE" 은 객체로 수집하지 않고 다른 엔티티도 유지', () => {
    const d = new DxfParser().parseSync(
      dxf({
        BLOCKS: [
          [0, 'BLOCK'], [5, '20'], [8, '0'], [2, 'B1'], [70, 0], [10, 0], [20, 0], [30, 0], [3, 'B1'],
          [0, 'LINE'], [5, '21'], [8, '0'], [10, 0], [20, 0], [11, 1], [21, 1],
          [0, 'ENDBLK'], [5, '22'], [8, '0'], [100, 'AcDbBlockEnd'],
        ],
        ENTITIES: [
          [0, 'MLEADERSTYLE'], [5, '99'], [3, 'stray'],
          [0, 'LINE'], [5, '30'], [8, '0'], [10, 0], [20, 0], [11, 5], [21, 5],
        ],
        OBJECTS: head('40'),
      }),
    )
    expect(d.blocks.B1.entities?.[0]).toMatchObject({ type: 'LINE', handle: '21' })
    expect(d.entities).toHaveLength(1)
    expect(d.objects.byName.MLEADERSTYLE.map((o: any) => o.handle)).toEqual(['40'])
  })

  it('M-04 MULTILEADER 엔티티의 스타일 핸들(340) 이 MLEADERSTYLE handle 로 해석 가능', () => {
    const d = new DxfParser().parseSync(
      dxf({
        ENTITIES: [
          [0, 'MULTILEADER'], [5, '50'], [8, '0'], [100, 'AcDbEntity'], [100, 'AcDbMLeader'], [340, '1A'],
        ],
        OBJECTS: head('1A'),
      }),
    )
    const styleHandles = d.objects.byName.MLEADERSTYLE.map((o: any) => o.handle)
    expect(styleHandles).toContain('1A')
    expect(d.entities.length).toBe(1)
  })
})

describe('MLEADERSTYLE 회귀 (R)', () => {
  it('R-01 MLEADERSTYLE 추가가 MLINESTYLE / LAYOUT 파싱에 영향 없음', () => {
    const r = parseObj([
      [0, 'MLINESTYLE'], [5, 'M1'], [2, 'STANDARD'], [70, 0], [3, ''], [62, 256], [51, 90], [52, 90], [71, 0],
      ...FULL,
      [0, 'LAYOUT'], [5, 'L1'], [100, 'AcDbPlotSettings'], [1, 'Page'], [100, 'AcDbLayout'], [1, 'Layout1'], [70, 1], [71, 1],
    ])
    expect(r.byName.MLINESTYLE[0]).toMatchObject({ handle: 'M1', styleName: 'STANDARD' })
    expect(r.byName.LAYOUT[0]).toMatchObject({ handle: 'L1' })
    expect(r.byName.MLEADERSTYLE[0]).toEqual(FULL_EXPECTED)
  })

  it('R-02 MLEADERSTYLE 이 없는 도면은 byName 에 키가 생기지 않음', () => {
    const d = new DxfParser().parseSync(dxf({ OBJECTS: [[0, 'DICTIONARY'], [5, '1']] }))
    expect(d.objects.byName.MLEADERSTYLE).toBeUndefined()
  })

  it('R-03 공유 상태 누수 없음: 두 번 파싱해도 결과 동일, 첫 결과 불변', () => {
    const p = new DxfParser()
    const a = p.parseSync(dxf({ OBJECTS: FULL }))
    const b = p.parseSync(dxf({ OBJECTS: head('ZZ') }))
    expect(a.objects.byName.MLEADERSTYLE[0]).toEqual(FULL_EXPECTED)
    expect(b.objects.byName.MLEADERSTYLE[0]).toEqual({
      name: 'MLEADERSTYLE', handle: 'ZZ', ownerObjectId: 'C', subclassMarker: 'AcDbMLeaderStyle',
    })
  })

  it('R-04 프로토타입 오염 시도 문자열 값이 Object.prototype 을 건드리지 않음', () => {
    styles([...head(), [3, '__proto__'], [300, 'constructor.prototype']])
    expect(({} as any).polluted).toBeUndefined()
    expect(Object.prototype.hasOwnProperty('Standard')).toBe(false)
  })
})

describe('MLEADERSTYLE 실도면 기반 (F)', () => {
  it('F-01 AutoCAD 2018 기본 Standard/Annotative 쌍 (실도면 구조 재현)', () => {
    const autocad = (h: string, desc: string, annotative: 0 | 1): Pair[] => [
      [0, 'MLEADERSTYLE'], [5, h],
      [102, '{ACAD_REACTORS'], [330, '12D'], [102, '}'],
      [330, '12D'], [100, 'AcDbMLeaderStyle'],
      [179, 2], [170, 2], [171, 1], [172, 0], [90, 2], [40, '0.0'], [41, '0.0'], [173, 1],
      [91, -1056964608], [340, '14'], [92, -2], [290, 1], [42, '0.09'], [291, 1], [43, '0.36'],
      [3, desc], [341, ''], [44, '0.18'], [300, ''], [342, '11'], [174, 1], [175, 1], [176, 0],
      [178, 1], [93, -1056964608], [45, '0.18'], [292, 0], [297, 0], [46, '0.18'],
      [94, -1056964608], [47, '1.0'], [49, '1.0'], [140, '1.0'], [293, 1], [141, '0.0'], [294, 1],
      [177, 0], [142, '1.0'], [295, 0], [296, annotative], [143, '0.125'], [271, 0], [272, 9], [273, 9],
      [1001, 'ACAD_MLEADERVER'], [1070, 2],
    ]
    const d = new DxfParser().parseSync(
      dxf({ OBJECTS: [...autocad('12E', 'Standard', 0), ...autocad('3452D', 'Annotative', 1)] }, '\r\n'),
    )
    const [std, ann] = d.objects.byName.MLEADERSTYLE as MLeaderStyleDXFObject[]
    expect(std).toMatchObject({ handle: '12E', description: 'Standard', annotative: false, textHeight: 0.18, arrowheadId: '' })
    expect(ann).toMatchObject({ handle: '3452D', description: 'Annotative', annotative: true, topTextAttachmentDirection: 9 })
    expect(ann.xdata).toEqual([{ appName: 'ACAD_MLEADERVER', value: [2] }])
  })
})

describe('MLEADERSTYLE 성능 (P)', () => {
  it('P-01 5,000 개 연속 객체를 모두 파싱 (시간 상한 넉넉히)', () => {
    const N = 5000
    const body: Pair[] = []
    for (let i = 0; i < N; i++) {
      for (const p of FULL.map(([c, v]): Pair => (c === 5 ? [5, (0x1000 + i).toString(16).toUpperCase()] : [c, v]))) body.push(p)
    }
    const text = dxf({ OBJECTS: body })
    const t0 = performance.now()
    const d = new DxfParser().parseSync(text)
    const ms = performance.now() - t0
    expect(d.objects.byName.MLEADERSTYLE).toHaveLength(N)
    expect(d.objects.byName.MLEADERSTYLE[N - 1].handle).toBe((0x1000 + N - 1).toString(16).toUpperCase())
    expect(ms).toBeLessThan(10000)
  })

  it('P-02 긴 문자열(1MB description) 처리', () => {
    const long = '가'.repeat(1_000_000)
    const [s] = styles([...head(), [3, long]])
    expect(s.description.length).toBe(1_000_000)
  })
})
