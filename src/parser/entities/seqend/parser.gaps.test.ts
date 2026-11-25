/**
 * SEQEND 완전성 보강 테스트(G-xx). TEST_SCENARIOS.md 의 "G. 완전성 보강" 절과 1:1 대응.
 * 기존 적대 테스트가 다루지 않은 공통 그룹코드(310/160/92, 사용자 102 그룹)와
 * 약한 단언(toBeDefined/not.toThrow)을 구체 값으로 보강한다.
 */
import { describe, test, expect } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseEntities } from '../parser.ts'

type G = (string | number)[]
function ents(groups: G) {
  const scanner = new DxfArrayScanner([...groups, '0', 'ENDSEC', '0', 'EOF'].map(String))
  return parseEntities(scanner.next(), scanner) as any[]
}
const LINE = (h: string): G => [
  '0', 'LINE', '5', h, '8', '0', '100', 'AcDbEntity', '100', 'AcDbLine',
  '10', '0', '20', '0', '30', '0', '11', '1', '21', '1', '31', '0',
]

describe('SEQEND 완전성 보강 (G)', () => {
  test('G-01 310 프록시 그래픽 여러 청크 → 순서대로 이어 붙임', () => {
    const [e, l] = ents(['0', 'SEQEND', '5', '1', '8', '0', '92', '4', '310', 'AABB', '310', 'CCDD', '310', 'EE', ...LINE('99')])
    expect(e.proxyEntity).toBe('AABBCCDDEE')
    expect(e.proxyByte).toBe(4)
    expect(l.handle).toBe('99')
  })

  test('G-02 160(대용량 프록시 바이트 수) → proxyByte', () => {
    const [e] = ents(['0', 'SEQEND', '5', '1', '160', '123456', ...LINE('99')])
    expect(e.proxyByte).toBe(123456)
  })

  test('G-03 사용자 앱 102 그룹 → extensions 에 키로 보존, 뒤 필드 계속 파싱', () => {
    const [e, l] = ents([
      '0', 'SEQEND', '5', '1', '102', '{MYAPP', '1000', 'hello', '70', '7', '102', '}',
      '330', '2', '100', 'AcDbEntity', '8', 'L', ...LINE('99'),
    ])
    expect(Object.keys(e.extensions ?? {})).toContain('MYAPP')
    expect(e.extensions.MYAPP.map((g: any) => g.value)).toEqual(['hello', 7])
    expect(e.ownerBlockRecordSoftId).toBe('2')
    expect(e.layer).toBe('L')
    expect(l.handle).toBe('99')
  })

  test('G-04 handle 없는 SEQEND 둘 → 서로 다른 자동 handle(D-01 의 toBeDefined 보강)', () => {
    const [a, b] = ents(['0', 'SEQEND', '0', 'SEQEND', ...LINE('99')])
    expect(a.handle).toEqual(expect.anything())
    expect(String(a.handle)).not.toBe('')
    expect(a.handle).not.toBe(b.handle)
  })

  test('G-05 닫히지 않은 102 블록 뒤 엔티티 경계(S-09 의 not.toThrow 보강)', () => {
    const list = ents(['0', 'SEQEND', '5', '1', '102', '{ACAD_REACTORS', '330', '2', ...LINE('99')])
    expect(list[0].type).toBe('SEQEND')
    expect(list[0].handle).toBe('1')
    // 0 그룹에서 확장 수집이 멈추므로 다음 LINE 을 잃지 않는다
    expect(list.map((x) => x.type)).toEqual(['SEQEND', 'LINE'])
  })

  test('G-06 SEQEND 에 엔티티와 무관한 기하 코드(10/20/30) → 필드로 흘러들지 않음', () => {
    const [e, l] = ents(['0', 'SEQEND', '5', '1', '8', 'A', '10', '5', '20', '6', '30', '7', ...LINE('99')])
    expect(e.layer).toBe('A')
    expect(e).not.toHaveProperty('startPoint')
    expect(e).not.toHaveProperty('position')
    expect(l).toMatchObject({ type: 'LINE', handle: '99' })
  })

  test('G-07 __proto__/constructor 형태 레이어·앱 이름 → 프로토타입 오염 없음', () => {
    const [e] = ents([
      '0', 'SEQEND', '5', '1', '8', '__proto__', '102', '{__proto__', '1000', 'x', '102', '}',
      '1001', '__proto__', '1000', 'y', ...LINE('99'),
    ])
    expect(e.layer).toBe('__proto__')
    expect(({} as any).x).toBeUndefined()
    expect(Object.prototype).not.toHaveProperty('1000')
  })
})
