import { readFileSync } from 'fs';
import { join } from 'path';
import { DxfArrayScanner } from '../../DxfArrayScanner';
import { parseExtensions } from "./parser";

describe('parseExtensions', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8"); 
    const scanner = new DxfArrayScanner(content.split("\n"));

    let curr = scanner.next() // {ACAD_REACTORS
    const entity: any = {}

    parseExtensions(curr, scanner, entity)

    expect(entity).toMatchObject({
      extensions: {
        ACAD_REACTORS: [
          { code: 330, value: 'X' }
        ]
      }
    })
  })

  test('tc1', () => {
    const content = readFileSync(join(__dirname, "./tc1.partial_dxf"), "utf-8"); 
    const scanner = new DxfArrayScanner(content.split("\n"));

    let curr = scanner.next() // {ACAD_REACTORS
    const entity: any = {}

    parseExtensions(curr, scanner, entity)

    curr = scanner.next()

    expect(entity).toMatchObject({
      extensions: {
        ACAD_REACTORS: [
          { code: 330, value: 'X' }
        ]
      }
    })
    expect(curr.code).toBe(330)
    expect(curr.value).toBe('Y')
  })
  
  test('tc2', () => {
    const content = readFileSync(join(__dirname, "./tc2.partial_dxf"), "utf-8"); 
    const scanner = new DxfArrayScanner(content.split("\n"));

    let curr = scanner.next() // {ACAD_REACTORS
    const entity: any = {}

    parseExtensions(curr, scanner, entity)

    curr = scanner.next()

    expect(entity).toMatchObject({
      extensions: {
        APP0: [
          { code: 330, value: 'V0' }
        ],
        APP1: [
          { code: 330, value: 'V1' }
        ]
      }
    })
    expect(curr.code).toBe(330)
    expect(curr.value).toBe('V2')
  })
  
  test('tc3', () => {
    const content = readFileSync(join(__dirname, "./tc3.partial_dxf"), "utf-8"); 
    const scanner = new DxfArrayScanner(content.split("\n"));

    let curr = scanner.next() // {ACAD_REACTORS
    const entity: any = {}

    // first extension
    parseExtensions(curr, scanner, entity)

    curr = scanner.next()
    expect(curr.code).toBe(330)
    expect(curr.value).toBe('U0')
    curr = scanner.next()

    // second extension
    parseExtensions(curr, scanner, entity)

    curr = scanner.next()
    expect(curr.code).toBe(330)
    expect(curr.value).toBe('U1')    
    curr = scanner.next()

    expect(entity).toMatchObject({
      extensions: {
        APP0: [
          { code: 330, value: 'V0' }
        ],
        APP1: [
          { code: 330, value: 'V1' }
        ]
      }
    })
  })
})