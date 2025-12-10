import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../DxfArrayScanner.ts'
import { parseDxfClass, parseDxfClasses } from './parser.ts'
import { DxfClass } from './types.ts'
import { ParsedDxf } from '../types.ts'

describe('CLASSES parser', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))

    let curr = scanner.next()
    curr = scanner.next() // skip 0

    const dxfClass = { type: 'CLASS' }
    parseDxfClass(curr, scanner, dxfClass)

    expect(dxfClass).toMatchObject<DxfClass>({
      name: 'ACDBDETAILVIEWSTYLE',
      cppClassName: 'AcDbDetailViewStyle',
      appName: 'ObjectDBX Classes',
      proxyFlag: 1025,
      instanceCount: 1,
      wasProxy: false,
      isEntity: false,
    })
  })

  test('tc1', () => {
    const content = readFileSync(join(__dirname, './tc1.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))

    let curr = scanner.next()
    curr = scanner.next()

    const dxf = {}
    parseDxfClasses(curr, scanner, dxf)

    expect((dxf as any).classes).toMatchObject<ParsedDxf['classes']>([
      {
        name: 'ACDBDETAILVIEWSTYLE',
        cppClassName: 'AcDbDetailViewStyle',
        appName: 'ObjectDBX Classes',
        instanceCount: 1,
        proxyFlag: 1025,
        wasProxy: false,
        isEntity: false,
      },
      {
        name: 'DIMASSOC',
        cppClassName: 'AcDbDimAssoc',
        appName: 'some app name',
        proxyFlag: 0,
        instanceCount: 3,
        wasProxy: false,
        isEntity: false,
      },
    ])
  })
})
