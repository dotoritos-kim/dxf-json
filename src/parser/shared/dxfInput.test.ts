import { describe, expect, it } from 'vitest'

import { BINARY_DXF_SENTINEL } from './binaryDxf.ts'
import { dxfInputToLines } from './dxfInput.ts'

function minimalBinaryDxfWithInvalidUtf8(): Uint8Array {
  const bytes: number[] = [...BINARY_DXF_SENTINEL]

  const pushGroup = (code: number, value: string | number[]) => {
    bytes.push(code & 0xff, (code >> 8) & 0xff)
    if (typeof value === 'string') {
      bytes.push(...new TextEncoder().encode(value), 0)
    } else {
      bytes.push(...value, 0)
    }
  }

  pushGroup(0, 'SECTION')
  pushGroup(2, 'HEADER')
  pushGroup(9, '$ACADVER')
  pushGroup(1, 'AC1021')
  pushGroup(1, [0xff])
  pushGroup(0, 'ENDSEC')
  pushGroup(0, 'EOF')

  return new Uint8Array(bytes)
}

describe('dxfInputToLines', () => {
  it('honors encodingFailureFatal for ASCII bytes', () => {
    const invalidUtf8 = new Uint8Array([0x30, 0x0a, 0xff, 0x0a, 0x53, 0x45, 0x43, 0x54, 0x49, 0x4f, 0x4e, 0x0a])

    expect(() =>
      dxfInputToLines(invalidUtf8, {
        encoding: 'utf-8',
        encodingFailureFatal: true,
      }),
    ).toThrow()
  })

  it('honors encodingFailureFatal for binary DXF string groups', () => {
    const data = minimalBinaryDxfWithInvalidUtf8()

    expect(() =>
      dxfInputToLines(data, {
        encoding: 'utf-8',
        encodingFailureFatal: true,
      }),
    ).toThrow()
  })
})
