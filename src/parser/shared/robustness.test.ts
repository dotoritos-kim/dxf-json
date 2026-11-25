import { describe, it, expect } from 'vitest'
import { DxfArrayScanner, parseBoolean, parseGroupValue } from '../DxfArrayScanner.ts'
import { parsePoint } from './parsePoint.ts'
import { parseBlocks } from '../blocks/parser.ts'
import { DxfParser } from '../DxfParser.ts'

function lines(...pairs: (string | number)[]) {
  return pairs.map(String)
}

describe('boolean group codes (290-299)', () => {
  it('keeps 0/1 behaviour', () => {
    expect(parseGroupValue(290, '0')).toBe(false)
    expect(parseGroupValue(290, '1')).toBe(true)
    expect(parseGroupValue(299, ' 1 ')).toBe(true)
  })

  it('does not throw for values other than 0/1 (non-zero -> true)', () => {
    expect(() => parseGroupValue(290, '2')).not.toThrow()
    expect(parseBoolean('2')).toBe(true)
    expect(parseBoolean('-1')).toBe(true)
    expect(parseBoolean('00')).toBe(false)
    expect(parseBoolean('0.0')).toBe(false)
    expect(parseBoolean('yes')).toBe(true)
    expect(parseBoolean('')).toBe(false)
  })
})

describe('parsePoint with missing y', () => {
  it('returns y=0 and rewinds instead of throwing', () => {
    const scanner = new DxfArrayScanner(lines(10, 5, 40, 2.5, 0, 'EOF'))
    scanner.next()
    const point = parsePoint(scanner)
    expect(point).toEqual({ x: 5, y: 0 })
    // the group that is not part of the point is left for the caller
    expect(scanner.next()).toEqual({ code: 40, value: 2.5 })
  })

  it('still parses complete 2D / 3D points as before', () => {
    let scanner = new DxfArrayScanner(lines(10, 1, 20, 2, 30, 3, 0, 'EOF'))
    scanner.next()
    expect(parsePoint(scanner)).toEqual({ x: 1, y: 2, z: 3 })

    scanner = new DxfArrayScanner(lines(10, 1, 20, 2, 40, 9, 0, 'EOF'))
    scanner.next()
    expect(parsePoint(scanner)).toEqual({ x: 1, y: 2 })
    expect(scanner.next().code).toBe(40)
  })

  it('a LINE with a broken start point does not break the whole file', () => {
    const dxf = lines(
      0, 'SECTION', 2, 'ENTITIES',
      0, 'LINE', 8, 'L', 10, 1, 11, 5, 21, 6, 31, 0,
      0, 'CIRCLE', 8, 'L', 10, 0, 20, 0, 30, 0, 40, 3,
      0, 'ENDSEC', 0, 'EOF',
    ).join('\n')
    const result = new DxfParser().parseSync(dxf)
    expect(result.entities.map((e: any) => e.type)).toEqual(['LINE', 'CIRCLE'])
    const line = result.entities[0] as any
    expect(line.startPoint).toEqual({ x: 1, y: 0 })
    expect(line.endPoint).toEqual({ x: 5, y: 6, z: 0 })
  })
})

describe('blocks without 100 AcDbBlockEnd (R12)', () => {
  it('ends the block at the next 0 group and keeps following blocks', () => {
    const scanner = new DxfArrayScanner(
      lines(
        0, 'BLOCK', 8, '0', 2, 'A', 70, 0, 10, 0, 20, 0, 30, 0,
        0, 'LINE', 8, '0', 10, 0, 20, 0, 30, 0, 11, 1, 21, 1, 31, 0,
        0, 'ENDBLK', 8, '0',
        0, 'BLOCK', 8, '0', 2, 'B', 70, 0, 10, 0, 20, 0, 30, 0,
        0, 'ENDBLK', 8, '0',
        0, 'ENDSEC',
        0, 'SECTION', 2, 'ENTITIES', 0, 'ENDSEC', 0, 'EOF',
      ),
    )
    const blocks = parseBlocks(scanner.next(), scanner)
    expect(Object.keys(blocks)).toEqual(['A', 'B'])
    expect(blocks.A.entities).toHaveLength(1)
    // the scanner must stop at ENDSEC, not swallow the following section
    expect(scanner.next()).toEqual({ code: 0, value: 'SECTION' })
  })

  it('a full R12 style file keeps the ENTITIES section after BLOCKS', () => {
    const dxf = lines(
      0, 'SECTION', 2, 'BLOCKS',
      0, 'BLOCK', 8, '0', 2, 'A', 70, 0, 10, 0, 20, 0, 30, 0,
      0, 'ENDBLK', 8, '0',
      0, 'ENDSEC',
      0, 'SECTION', 2, 'ENTITIES',
      0, 'CIRCLE', 8, 'L', 10, 0, 20, 0, 30, 0, 40, 3,
      0, 'ENDSEC', 0, 'EOF',
    ).join('\n')
    const result = new DxfParser().parseSync(dxf)
    expect(Object.keys(result.blocks)).toEqual(['A'])
    expect(result.entities).toHaveLength(1)
    expect(result.entities[0].type).toBe('CIRCLE')
  })
})

describe('unknown group codes inside an entity', () => {
  it('stops filling the entity but never loses the next entity', () => {
    // NOTE: createParser intentionally keeps stopping at an unknown code.
    // Continuing would add fields to the output of normal drawings,
    // which would change the existing results.
    const dxf = lines(
      0, 'SECTION', 2, 'ENTITIES',
      0, 'CIRCLE', 8, 'L', 10, 0, 20, 0, 30, 0, 12345, 'junk', 40, 3,
      0, 'LINE', 8, 'L', 10, 0, 20, 0, 30, 0, 11, 1, 21, 1, 31, 0,
      0, 'ENDSEC', 0, 'EOF',
    ).join('\n')
    const result = new DxfParser().parseSync(dxf)
    expect(result.entities.map((e: any) => e.type)).toEqual(['CIRCLE', 'LINE'])
  })
})
