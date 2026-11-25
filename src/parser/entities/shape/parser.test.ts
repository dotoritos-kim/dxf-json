import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { ShapeEntityParser } from './parser.ts'
import { parseEntities } from '../parser.ts'

describe('SHAPE', () => {
  test('basic case', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split(/\r\n|\r|\n/g))
    const parser = new ShapeEntityParser()

    let curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: '19AAD3',
      ownerBlockRecordSoftId: '19AA62',
      subclassMarker: 'AcDbShape',
      layer: '0',
      colorIndex: 7,
      insertionPoint: { x: 100, y: 200, z: 0 },
      size: 2.5,
      shapeName: 'ARROW',
      rotation: 45,
      xScale: 1.5,
      obliqueAngle: 10,
      thickness: 0.5,
      extrusionDirection: { x: 0, y: 0, z: 1 },
    })
  })

  test('defaults applied when optional codes are omitted', () => {
    const content = `  5
1A
100
AcDbEntity
  8
SYM
100
AcDbShape
 10
1
 20
2
 30
3
 40
5
  2
BOX
  0
EOF`
    const scanner = new DxfArrayScanner(content.split('\n'))
    const entity = new ShapeEntityParser().parseEntity(scanner, scanner.next())
    expect(entity).toMatchObject({
      handle: '1A',
      layer: 'SYM',
      insertionPoint: { x: 1, y: 2, z: 3 },
      size: 5,
      shapeName: 'BOX',
      thickness: 0,
      rotation: 0,
      xScale: 1,
      obliqueAngle: 0,
      extrusionDirection: { x: 0, y: 0, z: 1 },
    })
  })

  test('dispatched by parseEntities, following entity kept', () => {
    const content = `  0
SHAPE
  5
2B
100
AcDbEntity
  8
0
100
AcDbShape
 10
0
 20
0
 30
0
 40
1
  2
DOT
 50
90
  0
LINE
  5
2C
100
AcDbEntity
  8
0
100
AcDbLine
 10
0
 20
0
 30
0
 11
1
 21
1
 31
0
  0
ENDSEC
  0
EOF`
    const scanner = new DxfArrayScanner(content.split('\n'))
    const entities = parseEntities(scanner.next(), scanner)
    expect(entities).toHaveLength(2)
    expect(entities[0]).toMatchObject({
      type: 'SHAPE',
      handle: '2B',
      shapeName: 'DOT',
      size: 1,
      rotation: 90,
    })
    expect(entities[1]).toMatchObject({ type: 'LINE', handle: '2C' })
  })
})
