/**
 * Adversarial / exhaustive scenarios for SURFACE family parsers.
 * Scenario IDs map to TEST_SCENARIOS.md in this directory.
 */
import { describe, test, expect } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseEntities } from '../parser.ts'
import { DxfParser } from '../../DxfParser.ts'

type Pair = [number | string, string | number]

const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function lines(pairs: Pair[]): string[] {
  return pairs.flatMap(([c, v]) => [String(c), String(v)])
}

function header(type: string, handle = 'A1'): Pair[] {
  return [
    [0, type],
    [5, handle],
    [330, '1F'],
    [100, 'AcDbEntity'],
    [8, '0'],
    [100, 'AcDbModelerGeometry'],
    [70, 1],
  ]
}

const surfaceTail: Pair[] = [
  [100, 'AcDbSurface'],
  [71, 4],
  [72, 5],
]

function mat(code: number, values = identity): Pair[] {
  return values.map((v) => [code, v] as Pair)
}

/** parse pairs with parseEntities, appending `0 ENDSEC` */
function parse(pairs: Pair[], extra: Pair[] = []) {
  const scanner = new DxfArrayScanner(
    lines([...pairs, ...extra, [0, 'ENDSEC']]),
  )
  const entities = parseEntities(scanner.next(), scanner)
  return { entities, rest: scanner.next() }
}

function dxfOf(pairs: Pair[], blocks: Pair[] = []): string {
  const all: Pair[] = []
  if (blocks.length) {
    all.push([0, 'SECTION'], [2, 'BLOCKS'], ...blocks, [0, 'ENDSEC'])
  }
  all.push(
    [0, 'SECTION'],
    [2, 'ENTITIES'],
    ...pairs,
    [0, 'ENDSEC'],
    [0, 'EOF'],
  )
  return lines(all).join('\n')
}

const line: Pair[] = [
  [0, 'LINE'],
  [5, 'L1'],
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

const plain = (h = 'A1'): Pair[] => [
  ...header('SURFACE', h),
  [1, 'ACIS'],
  ...surfaceTail,
]

const extruded: Pair[] = [
  ...header('EXTRUDEDSURFACE'),
  ...surfaceTail,
  [100, 'AcDbExtrudedSurface'],
  [90, 17],
  [90, 4],
  [310, 'AABB'],
  [310, 'CCDD'],
  [10, 0], [20, 0], [30, 5],
  ...mat(40),
  [42, 0.1], [43, 0.2], [44, 0.3], [45, 0.4], [48, 2], [49, 0.5],
  ...mat(46),
  ...mat(47),
  [290, 1], [70, 3], [292, 1], [293, 1], [294, 0], [295, 1], [296, 0],
  [11, 1], [21, 0], [31, 0],
]

const swept: Pair[] = [
  ...header('SWEPTSURFACE'),
  ...surfaceTail,
  [100, 'AcDbSweptSurface'],
  [90, 7], [90, 2], [310, 'AA'],
  [90, 8], [90, 2], [310, 'BB'],
  ...mat(40),
  ...mat(41),
  [42, 0], [43, 0], [44, 0], [45, 0], [48, 1], [49, 0],
  ...mat(46), ...mat(47),
  [290, 0], [70, 1], [292, 0], [293, 0], [294, 0], [295, 0], [296, 0],
  [11, 0], [21, 1], [31, 0],
]

const revolved: Pair[] = [
  ...header('REVOLVEDSURFACE'),
  ...surfaceTail,
  [100, 'AcDbRevolvedSurface'],
  [90, 23], [90, 2], [310, 'EEFF'],
  [10, 1], [20, 2], [30, 3],
  [11, 0], [21, 0], [31, 1],
  [40, 3.14], [41, 0.5],
  ...mat(42),
  [43, 0], [44, 0], [45, 0], [46, 0],
  [290, 1], [291, 0],
]

const lofted: Pair[] = [
  ...header('LOFTEDSURFACE'),
  ...surfaceTail,
  [100, 'AcDbLoftedSurface'],
  ...mat(40),
  [90, 2], [310, 'C1'],
  [90, 2], [310, 'C2'],
  [70, 1], [41, 0.1], [42, 0.2], [43, 1], [44, 2],
  [290, 1], [291, 0], [292, 1], [293, 0], [294, 1], [295, 0], [296, 1],
]

const planar: Pair[] = [
  ...header('PLANESURFACE'),
  ...surfaceTail,
  [100, 'AcDbPlaneSurface'],
  [90, 9],
]

const nurbs: Pair[] = [
  ...header('NURBSURFACE'),
  ...surfaceTail,
  [100, 'AcDbNurbSurface'],
]

// ---------------------------------------------------------------- N
describe('N: 정상 - 서브타입 전 그룹코드', () => {
  test('N-01 SURFACE 기본 필드', () => {
    const { entities, rest } = parse(plain())
    expect(entities).toHaveLength(1)
    expect(entities[0]).toMatchObject({
      type: 'SURFACE', handle: 'A1', ownerBlockRecordSoftId: '1F', layer: '0',
      version: 1, data: 'ACIS', subclassMarker: 'AcDbSurface',
      uIsolineCount: 4, vIsolineCount: 5,
    })
    expect(rest).toMatchObject({ code: 0, value: 'ENDSEC' })
  })

  test('N-02 EXTRUDEDSURFACE 전 필드', () => {
    const [e] = parse(extruded).entities as any[]
    expect(e).toMatchObject({
      type: 'EXTRUDEDSURFACE', classId: 17, sweepEntityDataSize: 4,
      sweepEntityData: 'AABBCCDD', sweepVector: { x: 0, y: 0, z: 5 },
      transform: identity, draftAngle: 0.1, draftStartDistance: 0.2,
      draftEndDistance: 0.3, twistAngle: 0.4, scaleFactor: 2, alignAngle: 0.5,
      sweepEntityTransform: identity, pathEntityTransform: identity,
      isSolid: true, sweepAlignment: 3, isAlignedToStart: true, isBanked: true,
      isBasePointSet: false, isSweepEntityTransformComputed: true,
      isPathEntityTransformComputed: false,
      referenceVectorForTwist: { x: 1, y: 0, z: 0 },
    })
  })

  test('N-03 SWEPTSURFACE 전 필드', () => {
    const [e] = parse(swept).entities as any[]
    expect(e).toMatchObject({
      type: 'SWEPTSURFACE', sweepEntityId: 7, sweepEntityDataSize: 2,
      sweepEntityData: 'AA', pathEntityId: 8, pathEntityDataSize: 2,
      pathEntityData: 'BB', sweepEntityTransformMatrix: identity,
      pathEntityTransformMatrix: identity, sweepEntityTransform: identity,
      pathEntityTransform: identity, sweepAlignment: 1,
      referenceVectorForTwist: { x: 0, y: 1, z: 0 },
    })
  })

  test('N-04 REVOLVEDSURFACE 전 필드', () => {
    const [e] = parse(revolved).entities as any[]
    expect(e).toMatchObject({
      type: 'REVOLVEDSURFACE', revolveEntityId: 23, revolveEntityDataSize: 2,
      revolveEntityData: 'EEFF', axisPoint: { x: 1, y: 2, z: 3 },
      axisVector: { x: 0, y: 0, z: 1 }, revolveAngle: 3.14, startAngle: 0.5,
      transform: identity, draftAngle: 0, twistAngle: 0, isSolid: true,
      isCloseToAxis: false,
    })
  })

  test('N-05 LOFTEDSURFACE 전 필드', () => {
    const [e] = parse(lofted).entities as any[]
    expect(e).toMatchObject({
      type: 'LOFTEDSURFACE', transform: identity,
      entityData: [{ size: 2, data: 'C1' }, { size: 2, data: 'C2' }],
      planeNormalLoftingType: 1, startDraftAngle: 0.1, endDraftAngle: 0.2,
      startDraftMagnitude: 1, endDraftMagnitude: 2,
      isArcLengthParameterization: true, isNoTwist: false,
      isAlignDirection: true, isSimpleSurfaces: false, isClosed: true,
      isRuled: false, isVirtualGuide: true,
    })
  })

  test('N-06 PLANESURFACE', () => {
    const [e] = parse(planar).entities as any[]
    expect(e).toMatchObject({
      type: 'PLANESURFACE', classId: 9,
      surfaceSubclassMarker: 'AcDbPlaneSurface',
    })
  })

  test('N-07 NURBSURFACE', () => {
    const [e] = parse(nurbs).entities as any[]
    expect(e).toMatchObject({
      type: 'NURBSURFACE', surfaceSubclassMarker: 'AcDbNurbSurface',
      uIsolineCount: 4, vIsolineCount: 5,
    })
  })

  test('N-08 R2013+ 리비전 GUID, 머티리얼, 히스토리', () => {
    const [e] = parse([
      [0, 'SURFACE'], [5, 'B'], [100, 'AcDbEntity'], [8, 'L'], [347, '66'],
      [100, 'AcDbModelerGeometry'], [290, 1], [2, '{G}'], [350, 'H1'],
      ...surfaceTail,
    ]).entities as any[]
    expect(e).toMatchObject({
      materialObjectHardId: '66', hasRevisionGuid: true, guid: '{G}',
      historyObjectSoftId: 'H1',
    })
  })

  test('N-09 ACIS 1 + 3 긴 문자열 결합', () => {
    const [e] = parse([
      ...header('SURFACE'), [3, 'AAA'], [3, 'BBB'], [1, 'CCC'], ...surfaceTail,
    ]).entities as any[]
    expect(typeof e.data).toBe('string')
    expect(e.data).toContain('CCC')
    expect(e).not.toHaveProperty('_code1text')
    expect(e).not.toHaveProperty('_code3text')
  })
})

// ---------------------------------------------------------------- D
describe('D: 기본값/선택 코드 누락', () => {
  test('D-01 AcDbSurface 없음 (헤더만)', () => {
    const { entities, rest } = parse(header('SURFACE'))
    expect(entities[0]).toMatchObject({ type: 'SURFACE', version: 1 })
    expect(entities[0]).not.toHaveProperty('uIsolineCount')
    expect(rest.value).toBe('ENDSEC')
  })

  test('D-02 isoline 누락', () => {
    const [e] = parse([...header('SURFACE'), [100, 'AcDbSurface']]).entities
    expect(e).toMatchObject({ subclassMarker: 'AcDbSurface' })
    expect(e).not.toHaveProperty('uIsolineCount')
  })

  test('D-03 서브클래스 본문 전부 누락', () => {
    for (const t of [
      'EXTRUDEDSURFACE', 'SWEPTSURFACE', 'REVOLVEDSURFACE', 'LOFTEDSURFACE',
      'PLANESURFACE', 'NURBSURFACE',
    ]) {
      const { entities, rest } = parse([...header(t), ...surfaceTail])
      expect(entities[0].type).toBe(t)
      expect(rest.value).toBe('ENDSEC')
    }
  })

  test('D-04 90 크기 다음 310 없음 -> 빈 데이터', () => {
    const [e] = parse([
      ...header('REVOLVEDSURFACE'), ...surfaceTail,
      [100, 'AcDbRevolvedSurface'],
      [90, 1], [90, 0], [10, 1], [20, 1], [30, 1],
    ]).entities as any[]
    expect(e.revolveEntityDataSize).toBe(0)
    expect(e.revolveEntityData).toBe('')
    expect(e.axisPoint).toEqual({ x: 1, y: 1, z: 1 })
  })

  test('D-06 AcDbModelerGeometry 마커 누락: 마커는 위치 기반이라 isoline 유실 (문서화)', () => {
    const { entities } = parse(
      [[0, 'SURFACE'], [5, 'X'], [100, 'AcDbEntity'], [8, '0'], ...surfaceTail],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
    expect(entities[0]).not.toHaveProperty('uIsolineCount')
  })

  test('D-05 핸들/레이어 없는 최소 엔티티', () => {
    const { entities } = parse([[0, 'SURFACE']])
    expect(entities).toHaveLength(1)
    expect(entities[0].type).toBe('SURFACE')
  })
})

// ---------------------------------------------------------------- B
describe('B: 경계값', () => {
  test('B-01 0/음수/큰값/지수 표기', () => {
    const [e] = parse([
      ...header('REVOLVEDSURFACE'), ...surfaceTail,
      [100, 'AcDbRevolvedSurface'],
      [90, 0], [90, 0],
      [10, '-1e308'], [20, '1.7976931348623157E+308'], [30, '-0.0'],
      [40, '-6.283185307179586'], [41, '1e-300'],
    ]).entities as any[]
    expect(e.axisPoint.x).toBe(-1e308)
    expect(e.axisPoint.y).toBe(1.7976931348623157e308)
    expect(Object.is(e.axisPoint.z, -0)).toBe(true)
    expect(e.revolveAngle).toBeCloseTo(-6.283185307179586)
    expect(e.startAngle).toBe(1e-300)
  })

  test('B-02 NaN/비숫자 실수 값은 크래시 없이 NaN', () => {
    const { entities, rest } = parse([
      ...header('REVOLVEDSURFACE'), ...surfaceTail,
      [100, 'AcDbRevolvedSurface'],
      [40, 'NaN'], [41, 'abc'],
    ])
    const e = entities[0] as any
    expect(Number.isNaN(e.revolveAngle)).toBe(true)
    expect(Number.isNaN(e.startAngle)).toBe(true)
    expect(rest.value).toBe('ENDSEC')
  })

  test('B-03 isoline 음수/매우 큰 값', () => {
    const [e] = parse([
      ...header('SURFACE'), [100, 'AcDbSurface'], [71, -1], [72, 2147483647],
    ]).entities as any[]
    expect(e.uIsolineCount).toBe(-1)
    expect(e.vIsolineCount).toBe(2147483647)
  })

  test('B-04 빈 문자열 레이어/GUID/ACIS', () => {
    const [e] = parse([
      [0, 'SURFACE'], [5, 'X'], [100, 'AcDbEntity'], [8, ''],
      [100, 'AcDbModelerGeometry'], [70, 1], [1, ''], [290, 1], [2, ''],
      ...surfaceTail,
    ]).entities as any[]
    expect(e.layer).toBe('')
    expect(e.guid).toBe('')
    expect(e.uIsolineCount).toBe(4)
  })

  test('B-05 유니코드/한글/\\U+ 이스케이프 레이어', () => {
    const [e] = parse([
      [0, 'SURFACE'], [5, 'X'], [100, 'AcDbEntity'], [8, '벽체-\\U+AC00'],
      [100, 'AcDbModelerGeometry'], [70, 1], [1, '한글 ACIS'],
      ...surfaceTail,
    ]).entities as any[]
    expect(e.layer.startsWith('벽체-')).toBe(true)
    expect(e.uIsolineCount).toBe(4)
  })

  test('B-06 매우 긴 310 바이너리(1000 청크)', () => {
    const chunks: Pair[] = Array.from(
      { length: 1000 },
      () => [310, 'FF'.repeat(127)] as Pair,
    )
    const [e] = parse([
      ...header('EXTRUDEDSURFACE'), ...surfaceTail,
      [100, 'AcDbExtrudedSurface'],
      [90, 1], [90, 127000], ...chunks, [10, 1], [20, 2], [30, 3],
    ]).entities as any[]
    expect(e.sweepEntityData.length).toBe(254000)
    expect(e.sweepVector).toEqual({ x: 1, y: 2, z: 3 })
  })

  test('B-07 boolean 0/1 외 값(2): 현재 스캐너가 TypeError 를 던짐 (문서화)', () => {
    // DxfArrayScanner 공통 동작(290~299 는 0/1 만 허용). SURFACE 고유 버그 아님.
    expect(() =>
      parse([
        ...header('REVOLVEDSURFACE'), ...surfaceTail,
        [100, 'AcDbRevolvedSurface'], [290, 2],
      ]),
    ).toThrow(TypeError)
  })

  test.todo('B-07b boolean 비정상 값을 엔티티 단위로 격리할지 결정 (스캐너 공통 정책)')
})

// ---------------------------------------------------------------- O
describe('O: 순서 뒤섞임/중복', () => {
  test('O-01 71/72 순서 반전', () => {
    const [e] = parse([
      ...header('SURFACE'), [100, 'AcDbSurface'], [72, 9], [71, 8],
    ]).entities as any[]
    expect(e).toMatchObject({ uIsolineCount: 8, vIsolineCount: 9 })
  })

  test('O-02 중복 스칼라 코드: 첫 값 유지, 이후 필드는 버림, 다음 엔티티 유지 (문서화)', () => {
    const { entities } = parse(
      [...header('SURFACE'), [100, 'AcDbSurface'], [71, 1], [71, 2], [72, 7]],
      line,
    )
    const e = entities[0] as any
    expect(e.uIsolineCount).toBe(1)
    expect(e).not.toHaveProperty('vIsolineCount')
    expect(entities.map((x) => x.type)).toEqual(['SURFACE', 'LINE'])
  })

  test('O-03 서브클래스 내부 스칼라 순서 뒤섞임', () => {
    const [e] = parse([
      ...header('REVOLVEDSURFACE'), ...surfaceTail,
      [100, 'AcDbRevolvedSurface'],
      [291, 1], [41, 0.7], [40, 1.5], [290, 0],
    ]).entities as any[]
    expect(e).toMatchObject({
      isCloseToAxis: true, startAngle: 0.7, revolveAngle: 1.5, isSolid: false,
    })
  })

  test('O-04 AcDbSurface 이후 공통 코드 8 재등장해도 다음 엔티티 유지', () => {
    const { entities } = parse([...plain(), [8, 'LATE']], line)
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
  })

  test('O-05 행렬 코드가 다른 코드와 교차', () => {
    const [e] = parse([
      ...header('EXTRUDEDSURFACE'), ...surfaceTail,
      [100, 'AcDbExtrudedSurface'],
      [40, 1], [42, 0.9], [40, 2],
    ]).entities as any[]
    expect(e.transform).toEqual([1, 2])
    expect(e.draftAngle).toBe(0.9)
  })
})

// ---------------------------------------------------------------- S
describe('S: 구조 적대적', () => {
  test('S-01 0 바로 다음 다른 엔티티', () => {
    const { entities } = parse([[0, 'SURFACE']], line)
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
  })

  test('S-02 310 도중 다음 엔티티', () => {
    const { entities } = parse(
      [
        ...header('EXTRUDEDSURFACE'), ...surfaceTail,
        [100, 'AcDbExtrudedSurface'],
        [90, 1], [90, 4], [310, 'AA'],
      ],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual(['EXTRUDEDSURFACE', 'LINE'])
    expect((entities[0] as any).sweepEntityData).toBe('AA')
  })

  test('S-03 끝부분 알 수 없는 그룹코드: 필드 유지, 다음 엔티티 유지', () => {
    const { entities } = parse(
      [...plain(), [77, 3], [450, 1], [1234, 'y']],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
    expect((entities[0] as any).vIsolineCount).toBe(5)
  })

  test('S-03b 중간 알 수 없는 그룹코드: 이후 필드는 버려짐, 다음 엔티티 유지 (문서화)', () => {
    const { entities } = parse(
      [...header('SURFACE'), [999, 'x'], ...surfaceTail],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
    expect(entities[0]).toMatchObject({ handle: 'A1', version: 1 })
    expect(entities[0]).not.toHaveProperty('uIsolineCount')
  })

  test('S-04 잘못된 타입 값(정수 코드에 문자열)', () => {
    const { entities } = parse(
      [...header('SURFACE'), [100, 'AcDbSurface'], [71, 'many'], [72, '3.7']],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
  })

  test('S-05 XDATA/리액터/확장딕셔너리 혼합', () => {
    const { entities } = parse(
      [
        [0, 'SURFACE'], [5, 'X1'],
        [102, '{ACAD_REACTORS'], [330, 'R1'], [102, '}'],
        [102, '{ACAD_XDICTIONARY'], [360, 'D1'], [102, '}'],
        [330, '1F'], [100, 'AcDbEntity'], [8, '0'],
        [100, 'AcDbModelerGeometry'], [70, 1], ...surfaceTail,
        [1001, 'APP'], [1000, 'hello'], [1070, 3], [1040, 1.5],
      ],
      line,
    )
    const e = entities[0] as any
    expect(entities.map((x) => x.type)).toEqual(['SURFACE', 'LINE'])
    expect(e.ownerBlockRecordSoftId).toBe('1F')
    expect(e.uIsolineCount).toBe(4)
    expect(e.xdata?.[0]?.appName).toBe('APP')
  })

  test('S-06 CRLF + 공백 패딩 (parseSync)', () => {
    const text = dxfOf([...plain(), ...line])
      .split('\n')
      .map((l) => (/^\d+$/.test(l) ? l.padStart(3, ' ') : l))
      .join('\r\n')
    const dxf = new DxfParser().parseSync(text)
    expect(dxf.entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
    expect((dxf.entities[0] as any).uIsolineCount).toBe(4)
  })

  test('S-07 ENDSEC 없이 EOF 로 끝난 엔티티 (parseSync)', () => {
    const text = lines([
      [0, 'SECTION'], [2, 'ENTITIES'], ...header('SURFACE'),
      [100, 'AcDbSurface'], [71, 2], [0, 'EOF'],
    ]).join('\n')
    const dxf = new DxfParser().parseSync(text)
    expect(dxf.entities?.[0]?.type).toBe('SURFACE')
    expect((dxf.entities?.[0] as any)?.uIsolineCount).toBe(2)
  })

  test('S-08 값 줄 없이 잘린 파일: 무한루프 없이 끝남(예외는 Error 로만)', () => {
    const text =
      lines([[0, 'SECTION'], [2, 'ENTITIES'], ...header('SURFACE')]).join(
        '\n',
      ) + '\n 71'
    let err: unknown
    try {
      new DxfParser().parseSync(text)
    } catch (e) {
      err = e
    }
    if (err !== undefined) expect(err).toBeInstanceOf(Error)
  })

  test('S-09 엉뚱한 서브클래스 마커 (SURFACE + AcDbRevolvedSurface)', () => {
    const { entities } = parse(
      [...plain(), [100, 'AcDbRevolvedSurface'], [90, 1], [40, 1]],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual(['SURFACE', 'LINE'])
  })
})

// ---------------------------------------------------------------- M
describe('M: 연속/혼합/BLOCKS', () => {
  test('M-01 7개 서브타입 + LINE 연속', () => {
    const { entities, rest } = parse(
      [
        ...plain(), ...extruded, ...swept, ...revolved, ...lofted, ...planar,
        ...nurbs,
      ],
      line,
    )
    expect(entities.map((e) => e.type)).toEqual([
      'SURFACE', 'EXTRUDEDSURFACE', 'SWEPTSURFACE', 'REVOLVEDSURFACE',
      'LOFTEDSURFACE', 'PLANESURFACE', 'NURBSURFACE', 'LINE',
    ])
    expect(rest.value).toBe('ENDSEC')
  })

  test('M-02 parseSync 경유 + BLOCKS 내부', () => {
    const blk: Pair[] = [
      [0, 'BLOCK'], [5, 'B0'], [100, 'AcDbEntity'], [8, '0'],
      [100, 'AcDbBlockBegin'], [2, 'SURFBLK'], [70, 0],
      [10, 0], [20, 0], [30, 0], [3, 'SURFBLK'],
      ...plain('BS'), ...revolved,
      [0, 'ENDBLK'], [5, 'BE'], [100, 'AcDbEntity'], [8, '0'],
      [100, 'AcDbBlockEnd'],
    ]
    const dxf = new DxfParser().parseSync(dxfOf([...extruded, ...line], blk))
    expect(dxf.entities.map((e) => e.type)).toEqual([
      'EXTRUDEDSURFACE', 'LINE',
    ])
    const b = (dxf.blocks as any).SURFBLK
    expect(b.entities.map((e: any) => e.type)).toEqual([
      'SURFACE', 'REVOLVEDSURFACE',
    ])
  })

  test('M-03 LINE 사이에 끼인 SURFACE', () => {
    const { entities } = parse([...line, ...plain(), ...line])
    expect(entities.map((e) => e.type)).toEqual(['LINE', 'SURFACE', 'LINE'])
  })
})

// ---------------------------------------------------------------- R
describe('R: 회귀', () => {
  test('R-01 LINE 파싱 결과가 SURFACE 유무와 무관', () => {
    const alone = parse(line).entities[0]
    const mixed = parse([...plain(), ...line]).entities[1]
    expect(mixed).toEqual(alone)
  })

  test('R-02 3DSOLID(공통 AcDbModelerGeometry) 영향 없음', () => {
    const { entities } = parse([
      [0, '3DSOLID'], [5, 'S1'], [100, 'AcDbEntity'], [8, '0'],
      [100, 'AcDbModelerGeometry'], [70, 1], [1, 'X'], ...plain(),
    ])
    expect(entities.map((e) => e.type)).toEqual(['3DSOLID', 'SURFACE'])
  })

  test('R-03 파서 재사용 시 상태 누수 없음', () => {
    const a = parse(lofted).entities[0] as any
    const b = parse(lofted).entities[0] as any
    expect(b.entityData).toHaveLength(2)
    expect(b).toEqual(a)
  })
})

// ---------------------------------------------------------------- T
describe('T: 서브타입 특이 케이스', () => {
  test('T-01 행렬 개수 부족(16 미만)은 있는 만큼 배열', () => {
    const [e] = parse([
      ...header('REVOLVEDSURFACE'), ...surfaceTail,
      [100, 'AcDbRevolvedSurface'],
      [42, 1], [42, 0], [42, 0],
    ]).entities as any[]
    expect(e.transform).toEqual([1, 0, 0])
  })

  test('T-02 행렬 개수 초과(17)도 그대로 보존', () => {
    const [e] = parse([
      ...header('EXTRUDEDSURFACE'), ...surfaceTail,
      [100, 'AcDbExtrudedSurface'],
      ...mat(40), [40, 9],
    ]).entities as any[]
    expect(e.transform).toHaveLength(17)
  })

  test('T-03 SWEPT 두 바이너리 블롭 분리', () => {
    const [e] = parse(swept).entities as any[]
    expect(e.sweepEntityData).toBe('AA')
    expect(e.pathEntityData).toBe('BB')
  })

  test('T-04 LOFTED 블롭 0개', () => {
    const [e] = parse([
      ...header('LOFTEDSURFACE'), ...surfaceTail,
      [100, 'AcDbLoftedSurface'], [70, 0],
    ]).entities as any[]
    expect(e.entityData).toBeUndefined()
    expect(e.planeNormalLoftingType).toBe(0)
  })

  test('T-05 AcDbSurface 이전 70(version) / 이후 70(sweepAlignment) 구분', () => {
    const [e] = parse(extruded).entities as any[]
    expect(e.version).toBe(1)
    expect(e.sweepAlignment).toBe(3)
  })

  test('T-06 AcDbSurface 이전 290(revisionGuid) / 이후 290(isSolid) 구분', () => {
    const [e] = parse([
      ...header('REVOLVEDSURFACE'), [290, 1], [2, '{G}'], ...surfaceTail,
      [100, 'AcDbRevolvedSurface'], [290, 0],
    ]).entities as any[]
    expect(e.hasRevisionGuid).toBe(true)
    expect(e.isSolid).toBe(false)
  })

  test('T-07 공통부 310(proxy graphics) 은 서브클래스 블롭에 섞이지 않음', () => {
    const [e] = parse([
      [0, 'EXTRUDEDSURFACE'], [5, 'P'], [100, 'AcDbEntity'], [8, '0'],
      [160, 8], [310, '0800000000000000'],
      [100, 'AcDbModelerGeometry'], [70, 1], ...surfaceTail,
      [100, 'AcDbExtrudedSurface'], [90, 1], [90, 1], [310, 'AB'],
    ]).entities as any[]
    expect(e.sweepEntityData).toBe('AB')
  })
})

// ---------------------------------------------------------------- P
describe('P: 성능', () => {
  test('P-01 SURFACE 계열 7000개 + LINE 1000개 3초 이내', () => {
    const one = [
      ...plain(), ...extruded, ...swept, ...revolved, ...lofted, ...planar,
      ...nurbs, ...line,
    ]
    const pairs: Pair[] = []
    for (let i = 0; i < 1000; i++) pairs.push(...one)
    const t = performance.now()
    const { entities } = parse(pairs)
    expect(entities).toHaveLength(8000)
    expect(performance.now() - t).toBeLessThan(3000)
  })
})

// ---------------------------------------------------------------- C (완전성 보강)
describe('C: 완전성 보강', () => {
  test('C-01 310 숫자형 16진 청크도 문자열로 결합 (선행 0 보존)', () => {
    const { entities } = parse([
      ...header('REVOLVEDSURFACE'),
      ...surfaceTail,
      [100, 'AcDbRevolvedSurface'],
      [90, 1],
      [90, 4],
      [310, '0012'],
      [310, '3400'],
      [40, 1],
    ])
    const e = entities[0] as any
    expect(e.revolveEntityData).toBe('00123400')
    expect(typeof e.revolveEntityData).toBe('string')
    expect(e.revolveEntityDataSize).toBe(4)
    expect(e.revolveAngle).toBe(1)
  })

  test('C-02 크기 0 블롭 (310 없음) → 빈 문자열, 다음 필드 유지', () => {
    const { entities } = parse([
      ...header('EXTRUDEDSURFACE'),
      ...surfaceTail,
      [100, 'AcDbExtrudedSurface'],
      [90, 17],
      [90, 0],
      [10, 1], [20, 2], [30, 3],
    ])
    const e = entities[0] as any
    expect(e.classId).toBe(17)
    expect(e.sweepEntityDataSize).toBe(0)
    expect(e.sweepEntityData).toBe('')
    expect(e.sweepVector).toEqual({ x: 1, y: 2, z: 3 })
  })

  test('C-03 LOFTED 블롭에 310 없음 → {size, data:""}', () => {
    const { entities } = parse([
      ...header('LOFTEDSURFACE'),
      ...surfaceTail,
      [100, 'AcDbLoftedSurface'],
      [90, 0],
      [90, 2], [310, 'AB'],
      [70, 2],
    ])
    const e = entities[0] as any
    expect(e.entityData).toEqual([
      { size: 0, data: '' },
      { size: 2, data: 'AB' },
    ])
    expect(e.planeNormalLoftingType).toBe(2)
  })

  test('C-04 ACIS 데이터 1 이 숫자처럼 보여도 문자열, 임시 필드 제거', () => {
    const { entities } = parse([
      ...header('SURFACE'),
      [1, '123'],
      [3, '456'],
      ...surfaceTail,
    ])
    const e = entities[0] as any
    expect(typeof e.data).toBe('string')
    expect(e.data).toContain('123')
    expect(e._code1text).toBeUndefined()
    expect(e._code3text).toBeUndefined()
    expect(e.uIsolineCount).toBe(4)
    expect(e.vIsolineCount).toBe(5)
  })

  test('C-05 350 히스토리 · 2 GUID · 290 정확한 값', () => {
    const { entities } = parse([
      [0, 'SURFACE'], [5, 'H1'], [100, 'AcDbEntity'], [8, 'L'],
      [100, 'AcDbModelerGeometry'],
      [70, 1], [1, 'X'], [290, 1], [2, '{ABC-123}'],
      [100, 'AcDbSurface'], [71, 0], [72, 0],
      [350, '2F'],
    ])
    const e = entities[0] as any
    expect(e.handle).toBe('H1')
    expect(e.layer).toBe('L')
    expect(e.version).toBe(1)
    expect(e.hasRevisionGuid).toBe(true)
    expect(e.guid).toBe('{ABC-123}')
    expect(e.uIsolineCount).toBe(0)
    expect(e.vIsolineCount).toBe(0)
  })

  test('C-06 102 반응자 그룹이 헤더에 있어도 본문 필드 유지', () => {
    const { entities, rest } = parse([
      [0, 'SURFACE'], [5, 'R1'],
      [102, '{ACAD_REACTORS'], [330, '9A'], [102, '}'],
      [330, '1F'], [100, 'AcDbEntity'], [8, '0'],
      [100, 'AcDbModelerGeometry'], [70, 1], [1, 'D'],
      ...surfaceTail,
    ])
    expect(entities).toHaveLength(1)
    const e = entities[0] as any
    expect(e.handle).toBe('R1')
    expect(e.data).toBe('D')
    expect(e.uIsolineCount).toBe(4)
    expect(rest.value).toBe('ENDSEC')
  })

  test('C-07 끝의 XDATA(1001) 뒤에도 다음 엔티티 유지', () => {
    const { entities } = parse([
      ...plain('X1'),
      [1001, 'APP'], [1000, 'hello'],
      ...line,
    ])
    expect(entities.map((e: any) => e.type)).toEqual(['SURFACE', 'LINE'])
    expect((entities[0] as any).vIsolineCount).toBe(5)
  })

  test('C-08 isoline 음수 보존, 소수는 정수 코드라 절삭(2.5→2)', () => {
    const { entities } = parse([
      ...header('SURFACE'),
      [100, 'AcDbSurface'], [71, -1], [72, 2.5],
    ])
    const e = entities[0] as any
    expect(e.uIsolineCount).toBe(-1)
    expect(e.vIsolineCount).toBe(2)
  })
})
