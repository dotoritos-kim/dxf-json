import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { DxfParser } from '../../../index.ts'

describe('parseVPortTable', () => {
  it('parses view height (group 40) and aspect ratio (group 41) from tc0', () => {
    const content = readFileSync(
      join(
        import.meta.dirname,
        '../../../../integration-test/src/tc0/tc.dxf',
      ),
      'utf-8',
    )
    const dxf = new DxfParser().parseSync(content)
    const active = dxf.tables?.VPORT?.entries?.find(
      entry => entry.name.toUpperCase() === '*ACTIVE',
    )

    expect(active?.viewHeight).toBeCloseTo(2582.878234598377, 6)
    expect(active?.aspectRatio).toBeCloseTo(1.828021978021977, 6)
  })
})
