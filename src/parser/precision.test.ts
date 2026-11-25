import { describe, expect, it } from 'vitest'

import { parseGroupValue, parseReal } from './DxfArrayScanner.ts'
import { DxfParser } from './DxfParser.ts'
import { DxfStreamParser } from '../stream-parser/DxfStreamParser.ts'

describe('real value parsing', () => {
  it('reads well-formed reals exactly like parseFloat', () => {
    for (const s of [
      '0',
      '-0.0',
      '1',
      '1.',
      '.5',
      '-.5',
      '+2.25',
      '0.1',
      '1e10',
      '1E-7',
      '123456789.123456789',
      '  3.14159265358979  ',
      '-1.7976931348623157e308',
      '4.9e-324',
      '929.9999985538689',
    ]) {
      expect(parseReal(s)).toBe(parseFloat(s.trim()))
      expect(parseGroupValue(10, s)).toBe(parseFloat(s.trim()))
    }
  })

  it('round-trips the shortest string of a double exactly', () => {
    for (const d of [0.1, 1 / 3, Math.PI, 1e-300, 123456.789e12]) {
      expect(parseReal(String(d))).toBe(d)
    }
  })

  it('returns NaN for malformed reals instead of truncating them', () => {
    for (const s of [
      '1,5',
      '1.#INF',
      '-1.#IND',
      '1.#QNAN',
      '0x10',
      'abc',
      '',
      '1.2.3',
    ]) {
      expect(parseReal(s)).toBeNaN()
    }
    for (const code of [10, 40, 110, 210, 460, 1010]) {
      expect(parseGroupValue(code, '1,5')).toBeNaN()
    }
  })

  it('does not turn malformed point coordinates into finite numbers', () => {
    const dxf = [
      '0', 'SECTION', '2', 'ENTITIES',
      '0', 'POINT', '10', '1,5', '20', '1.#INF', '30', '0',
      '0', 'ENDSEC', '0', 'EOF',
    ].join('\n')
    const point = new DxfParser().parseSync(dxf).entities[0] as any
    expect(point.position.x).toBeNaN()
    expect(point.position.y).toBeNaN()
    expect(point.position.z).toBe(0)
  })
})

describe('DxfStreamParser', () => {
  const dxf = [
    '0', 'SECTION', '2', 'HEADER',
    '9', '$EXTMIN', '10', '1', '20', '2', '30', '3',
    '9', '$LTSCALE', '40', '2.5',
    '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
    '0', 'POINT', '5', '1A', '8', '0', '10', '4', '20', '5', '30', '6',
    '0', 'LINE', '5', '1B', '8', '0', '10', '0', '20', '0', '30', '0',
    '11', '1', '21', '1', '31', '0',
    '0', 'ENDSEC', '0', 'EOF', '',
  ].join('\n')

  it('produces the same result as DxfParser.parseBuffer', async () => {
    const bytes = new TextEncoder().encode(dxf)
    const stream = new DxfStreamParser()
    await stream.FeedFile(bytes.buffer.slice(0) as ArrayBuffer)
    expect(stream.dxf.header.$EXTMIN).toEqual({ x: 1, y: 2, z: 3 })
    expect(stream.dxf.entities.map((e) => e.type)).toEqual(['POINT', 'LINE'])
    expect(JSON.stringify(stream.dxf)).toBe(
      JSON.stringify(new DxfParser().parseBuffer(bytes)),
    )
  })

  it('handles input split across many chunks', async () => {
    const points = Array.from(
      { length: 5000 },
      (_, i) =>
        `0\nPOINT\n5\n${(i + 0x100).toString(16)}\n8\n0\n10\n${i}.25\n20\n0\n30\n0`,
    ).join('\n')
    const big = dxf.replace('0\nENDSEC\n0\nEOF', `${points}\n0\nENDSEC\n0\nEOF`)
    const bytes = new TextEncoder().encode(big)
    expect(bytes.byteLength).toBeGreaterThan(0x10000)
    const stream = new DxfStreamParser()
    await stream.FeedFile(bytes.buffer.slice(0) as ArrayBuffer)
    expect(stream.dxf.entities.length).toBe(5002)
  })
})
