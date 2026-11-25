import { describe, expect, test } from 'vitest'
import { parseReal } from './DxfArrayScanner.ts'

describe('parseReal ReDoS safety', () => {
  test('long digit runs with a trailing invalid char finish quickly', () => {
    const evil = '9'.repeat(100_000) + 'x'
    const t = performance.now()
    expect(Number.isNaN(parseReal(evil))).toBe(true)
    expect(performance.now() - t).toBeLessThan(200)
  })
  test('valid forms still parse', () => {
    for (const [s, v] of [['1', 1], ['1.', 1], ['1.5', 1.5], ['.5', 0.5], ['-1e5', -1e5], ['+3E-2', 0.03], ['Infinity', Infinity], [' 2.25 ', 2.25]] as const)
      expect(parseReal(s)).toBe(v)
    for (const s of ['1,5', '1.#INF', '0x10', '12.5mm', '', '.', 'e5'])
      expect(Number.isNaN(parseReal(s))).toBe(true)
  })
})
