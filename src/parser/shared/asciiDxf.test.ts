import { describe, expect, it } from 'vitest'

import { assertAsciiDxf } from './asciiDxf.ts'

describe('assertAsciiDxf', () => {
  it('accepts ASCII DXF starting with SECTION', () => {
    expect(() => assertAsciiDxf('0\nSECTION\n')).not.toThrow()
  })

  it('accepts ASCII DXF with UTF-8 BOM', () => {
    expect(() => assertAsciiDxf('\uFEFF0\nSECTION\n')).not.toThrow()
  })

  it('rejects binary DXF text input', () => {
    expect(() => assertAsciiDxf('AutoCAD Binary DXF\r\n')).toThrow(
      /parseBuffer/,
    )
  })
})
