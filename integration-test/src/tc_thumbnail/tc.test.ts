import { describe, it, expect } from 'vitest'
import { DxfParser } from 'dxf-json'
import { join } from 'path'
import { readFileSync } from 'fs'

const dxfContent = readFileSync(join(__dirname, 'tc.dxf'), 'utf-8')

describe('Thumbnail Image Parsing', () => {
  it('should parse thumbnail image as base64 by default', () => {
    const parser = new DxfParser()
    const result = parser.parseSync(dxfContent)
    const expectedBase64 = Buffer.from('01020304', 'hex').toString('base64')
    expect(result.thumbnailImage?.data).toBe(expectedBase64)
    expect(result.thumbnailImage?.size).toBe(4)
  })

  it('should parse thumbnail image as hex when specified', () => {
    const parser = new DxfParser({ thumbnailImageFormat: 'hex' })
    const result = parser.parseSync(dxfContent)
    expect(result.thumbnailImage?.data).toBe('01020304')
    expect(result.thumbnailImage?.size).toBe(4)
  })
})
