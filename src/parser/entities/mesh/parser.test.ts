import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner'
import { MeshEntityParser } from "./parser"

describe('MESH', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new MeshEntityParser()

    let curr = scanner.next() // skip first line
    curr = scanner.next() 
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      subclassMarker: 'AcDbSubDMesh',
      version: 2,
      isBlendCreased: true,
      subdivisionLevel: 0,
      verticesCount: 8,
      totalFaceIndices: 30,
      faceIndices: [
        [0, 3, 2, 1],
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [3, 7, 6, 2],
        [0, 4, 7, 3],
      ],
      edgeCount: 4,
      edgeIndices: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
      edgeCreaseCount: 4,
      edgeCreaseWeights: [3, 3, 3, 3],
      overridenSubEntityCount: 0,
    })
  })
})