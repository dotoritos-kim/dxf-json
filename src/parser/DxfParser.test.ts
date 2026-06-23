import { afterEach, describe, expect, it, vi } from 'vitest'

import { DxfParser } from './DxfParser.ts'

const minimalAsciiDxf = '0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nEOF\n'

describe('DxfParser.parseFromUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses a successful response body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        arrayBuffer: async () => new TextEncoder().encode(minimalAsciiDxf).buffer,
      })),
    )

    const parser = new DxfParser()
    const result = await parser.parseFromUrl('https://example.com/test.dxf')

    expect(result.header).toBeDefined()
    expect(fetch).toHaveBeenCalledWith('https://example.com/test.dxf', undefined)
  })

  it('throws when the HTTP response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        arrayBuffer: async () => new ArrayBuffer(0),
      })),
    )

    const parser = new DxfParser()
    await expect(parser.parseFromUrl('https://example.com/missing.dxf')).rejects.toThrow(
      /Failed to fetch DXF: 404 Not Found/,
    )
  })

  it('throws when the response body is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        arrayBuffer: async () => new ArrayBuffer(0),
      })),
    )

    const parser = new DxfParser()
    await expect(parser.parseFromUrl('https://example.com/empty.dxf')).rejects.toThrow(
      /empty response body/,
    )
  })
})
