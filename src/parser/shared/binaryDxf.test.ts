import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

import { DxfParser } from '../DxfParser.ts'
import {
  BINARY_DXF_SENTINEL,
  binaryDxfToLines,
  isBinaryDxf,
} from './binaryDxf.ts'

type BinaryGroup = {
  code: number
  value: string | number | Uint8Array
}

function encodeBinaryDxf(
  groups: BinaryGroup[],
  options: { r12?: boolean; encoding?: string } = {},
): Uint8Array {
  const { r12 = false, encoding = 'utf-8' } = options
  const bytes: number[] = [...BINARY_DXF_SENTINEL]

  const pushInt16 = (value: number) => {
    bytes.push(value & 0xff, (value >> 8) & 0xff)
  }
  const pushInt32 = (value: number) => {
    bytes.push(
      value & 0xff,
      (value >> 8) & 0xff,
      (value >> 16) & 0xff,
      (value >> 24) & 0xff,
    )
  }
  const pushFloat64 = (value: number) => {
    const buffer = new ArrayBuffer(8)
    new DataView(buffer).setFloat64(0, value, true)
    bytes.push(...new Uint8Array(buffer))
  }
  const pushString = (value: string) => {
    bytes.push(...new TextEncoder().encode(value), 0)
  }

  for (const group of groups) {
    if (r12) {
      if (group.code > 255) {
        bytes.push(255)
        pushInt16(group.code)
      } else {
        bytes.push(group.code)
      }
    } else {
      pushInt16(group.code)
    }

    const { code, value } = group
    if (value instanceof Uint8Array) {
      bytes.push(value.length, ...value)
      continue
    }

    if (code >= 290 && code <= 299) {
      bytes.push(value ? 1 : 0)
    } else if (
      (code >= 60 && code < 80) ||
      (code >= 170 && code < 180) ||
      (code >= 270 && code < 290) ||
      (code >= 370 && code < 390) ||
      (code >= 400 && code < 410) ||
      (code >= 1060 && code < 1071)
    ) {
      pushInt16(Number(value))
    } else if (
      (code >= 90 && code < 100) ||
      (code >= 420 && code < 430) ||
      (code >= 440 && code < 460) ||
      code === 1071
    ) {
      pushInt32(Number(value))
    } else if (code >= 160 && code < 170) {
      const buffer = new ArrayBuffer(8)
      new DataView(buffer).setBigInt64(0, BigInt(value), true)
      bytes.push(...new Uint8Array(buffer))
    } else if (
      (code >= 10 && code < 60) ||
      (code >= 110 && code < 150) ||
      (code >= 210 && code < 240) ||
      (code >= 460 && code < 470) ||
      (code >= 1010 && code < 1060)
    ) {
      pushFloat64(Number(value))
    } else if (code >= 310 && code < 320) {
      const chunk =
        typeof value === 'string'
          ? new Uint8Array(
              value.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ??
                [],
            )
          : new Uint8Array()
      bytes.push(chunk.length, ...chunk)
    } else {
      pushString(String(value))
    }
  }

  return new Uint8Array(bytes)
}

describe('binaryDxf', () => {
  it('detects the binary DXF sentinel', () => {
    expect(isBinaryDxf(BINARY_DXF_SENTINEL)).toBe(true)
    expect(isBinaryDxf(new Uint8Array([0, 1, 2]))).toBe(false)
  })

  it('decodes a minimal binary DXF file', () => {
    const binary = encodeBinaryDxf([
      { code: 0, value: 'SECTION' },
      { code: 2, value: 'HEADER' },
      { code: 9, value: '$ACADVER' },
      { code: 1, value: 'AC1021' },
      { code: 0, value: 'ENDSEC' },
      { code: 0, value: 'EOF' },
    ])

    expect(binaryDxfToLines(binary)).toEqual([
      '0',
      'SECTION',
      '2',
      'HEADER',
      '9',
      '$ACADVER',
      '1',
      'AC1021',
      '0',
      'ENDSEC',
      '0',
      'EOF',
    ])
  })

  it('decodes R12 single-byte group codes', () => {
    const binary = encodeBinaryDxf(
      [
        { code: 0, value: 'SECTION' },
        { code: 2, value: 'HEADER' },
        { code: 9, value: '$ACADVER' },
        { code: 1, value: 'AC1009' },
        { code: 0, value: 'ENDSEC' },
        { code: 0, value: 'EOF' },
      ],
      { r12: true },
    )

    expect(binaryDxfToLines(binary)).toEqual([
      '0',
      'SECTION',
      '2',
      'HEADER',
      '9',
      '$ACADVER',
      '1',
      'AC1009',
      '0',
      'ENDSEC',
      '0',
      'EOF',
    ])
  })

  it('decodes R12 extended group codes above 255', () => {
    const binary = encodeBinaryDxf(
      [
        { code: 0, value: 'SECTION' },
        { code: 2, value: 'HEADER' },
        { code: 9, value: '$ACADVER' },
        { code: 1, value: 'AC1009' },
        { code: 420, value: 7 },
        { code: 0, value: 'ENDSEC' },
        { code: 0, value: 'EOF' },
      ],
      { r12: true },
    )

    const lines = binaryDxfToLines(binary)
    expect(lines).toContain('420')
    expect(lines).toContain('7')
  })

  it('decodes binary chunk groups as hex strings', () => {
    const binary = encodeBinaryDxf([
      { code: 0, value: 'SECTION' },
      { code: 2, value: 'HEADER' },
      { code: 9, value: '$ACADVER' },
      { code: 1, value: 'AC1021' },
      { code: 310, value: new Uint8Array([1, 2, 3, 4]) },
      { code: 0, value: 'ENDSEC' },
      { code: 0, value: 'EOF' },
    ])

    expect(binaryDxfToLines(binary)).toContain('01020304')
  })

  it('decodes binary chunk groups up to 255 bytes', () => {
    const chunk = new Uint8Array(255)
    chunk.fill(0xab)
    const binary = encodeBinaryDxf([
      { code: 0, value: 'SECTION' },
      { code: 2, value: 'HEADER' },
      { code: 9, value: '$ACADVER' },
      { code: 1, value: 'AC1021' },
      { code: 310, value: chunk },
      { code: 0, value: 'ENDSEC' },
      { code: 0, value: 'EOF' },
    ])

    expect(binaryDxfToLines(binary)).toContain('ab'.repeat(255))
  })

  it('parses binary DXF with the same result as ASCII for tc0', () => {
    const asciiPath = join(__dirname, '../../../integration-test/src/tc0/tc.dxf')
    const ascii = readFileSync(asciiPath, 'utf-8')
    const parser = new DxfParser()

    const asciiResult = parser.parseSync(ascii)
    const binary = encodeBinaryDxf(
      ascii
        .split(/\r\n|\r|\n/g)
        .reduce<BinaryGroup[]>((groups, line, index, lines) => {
          if (index % 2 === 0) {
            const code = Number.parseInt(line, 10)
            const value = lines[index + 1]
            if (code >= 310 && code < 320) {
              groups.push({
                code,
                value: new Uint8Array(
                  value.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ??
                    [],
                ),
              })
            } else if (code >= 290 && code <= 299) {
              groups.push({ code, value: value.trim() !== '0' })
            } else if (
              (code >= 10 && code < 60) ||
              (code >= 110 && code < 150) ||
              (code >= 210 && code < 240) ||
              (code >= 460 && code < 470) ||
              (code >= 1010 && code < 1060)
            ) {
              groups.push({ code, value: Number.parseFloat(value) })
            } else if (
              (code >= 90 && code < 100) ||
              (code >= 420 && code < 430) ||
              (code >= 440 && code < 460) ||
              code === 1071
            ) {
              groups.push({ code, value: Number.parseInt(value, 10) })
            } else if (code >= 160 && code < 170) {
              groups.push({ code, value: Number.parseInt(value, 10) })
            } else if (
              (code >= 60 && code < 80) ||
              (code >= 170 && code < 180) ||
              (code >= 270 && code < 290) ||
              (code >= 370 && code < 390) ||
              (code >= 400 && code < 410) ||
              (code >= 1060 && code < 1071)
            ) {
              groups.push({ code, value: Number.parseInt(value, 10) })
            } else {
              groups.push({ code, value })
            }
          }
          return groups
        }, []),
    )

    const binaryResult = parser.parseBuffer(binary)
    expect(binaryResult).toMatchObject(asciiResult)
  })
})
