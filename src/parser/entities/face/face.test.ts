import { readFileSync } from "fs"
import { join } from "path"
import DxfArrayScanner from "@src/parser/DxfArrayScanner"
import { FaceEntityParser } from "./parser"

describe('3DFACE', () => {
    test('basic case', () => {
      const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
      const scanner = new DxfArrayScanner(content.split('\n'))
        const parser = new FaceEntityParser()
        
        let curr = scanner.next()
        const entity = parser.parseEntity(scanner, curr)
        
        expect(entity).toMatchObject({
            subclassMarker: 'AcDbFace',
            vertices: [{
              x: -10, y: -20, z: -30,
            }, {
              x: -11, y: -21, z: -31,
            }, {
              x: -12, y: -22, z: -32,
            }, {
              x: -13, y: -23, z: -33,
            }]
        })
    })

    test('permutated vertices case', () => {
      const content = readFileSync(join(__dirname, './tc1.partial_dxf'), 'utf-8')
      const scanner = new DxfArrayScanner(content.split('\n'))
        const parser = new FaceEntityParser()
        
        let curr = scanner.next()
        const entity = parser.parseEntity(scanner, curr)
        
        expect(entity).toMatchObject({
            subclassMarker: 'AcDbFace',
            vertices: [{
              x: -10, y: -20, z: -30,
            }, {
              x: -11, y: -21, z: -31,
            }, {
              x: -12, y: -22, z: -32,
            }, {
              x: -13, y: -23, z: -33,
            }]
        })
    })
})