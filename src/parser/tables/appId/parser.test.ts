import { describe, expect, test } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseAppIdTableEntry } from './parser.ts'

describe('APPID', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))

    const entry: any = {}
    let curr = scanner.next()
    curr = scanner.next() // skip 0 APPID
    parseAppIdTableEntry(curr, scanner, entry)

    expect(entry).toMatchObject({
      handle: '9E',
      ownerObjectId: '9',
      subclassMarker: 'AcDbRegAppTableRecord',
      appName: 'ACAD_PSEXT',
    })
  })
})
