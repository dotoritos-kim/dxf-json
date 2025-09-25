import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner'
import { MLineEntityParser } from './parser'
import { MLineJustification } from './consts';
import type { MLineEntity } from './types';

describe('MLineDXFEntity parser', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
    const scanner = new DxfArrayScanner(content.split("\n"));
    const parseEntity = new MLineEntityParser()

    let curr = scanner.next()
    curr = scanner.next()
    const entity = parseEntity.parseEntity(scanner, curr)
    entity.type = 'MLINE'

    expect(entity).toMatchObject<MLineEntity>({
      type: 'MLINE',
      handle: '2B9',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      subclassMarker: 'AcDbMline',
      name: 'STANDARD',
      styleObjectHandle: '18',
      scale: 30,
      justification: MLineJustification.Top,
      flags: 1,
      vertexCount: 4,
      styleCount: 2,
      startPosition: { x: 0, y: 10, z: 0 },
      extrusionDirection: { x: 0, y: 0, z: 1 },
      segments: [
        {
          position: { x: 0, y: 10, z: 0 },
          direction: { x: 7, y: 7, z: 0 },
          miterDirection: { x: -7, y: 7, z: 0 },
          elements: [
            {
              parameterCount: 2,
              parameters: [0, 0],
              fillCount: 0,
            },
            {
              parameterCount: 2,
              parameters: [-30, 0],
              fillCount: 0,
            }
          ]
        },
        {
          position: { x: 40, y: 50, z: 0 },
          direction: { x: 8, y: -4, z: 0 },
          miterDirection: { x: -1, y: 9, z: 0 },
          elements: [
            {
              parameterCount: 2,
              parameters: [0, 0],
              fillCount: 0,
            },
            {
              parameterCount: 2,
              parameters: [-36, 0],
              fillCount: 0,
            }
          ]
        },
        {
          position: { x: 100, y: 20, z: 0 },
          direction: { x: 6, y: 8, z: 0 },
          miterDirection: { x: -2, y: 9, z: 0 },
          elements: [
            {
              parameterCount: 2,
              parameters: [0, 0],
              fillCount: 0,
            },
            {
              parameterCount: 2,
              parameters: [-39, 0],
              fillCount: 0,
            }
          ]
        },
        {
          position: { x: 130, y: 60, z: 0 },
          direction: { x: 6, y: 8, z: 0 },
          miterDirection: { x: -8, y: 6, z: 0 },
          elements: [
            {
              parameterCount: 2,
              parameters: [0, 0],
              fillCount: 0,
            },
            {
              parameterCount: 2,
              parameters: [-30, 0],
              fillCount: 0,
            }
          ]
        }
      ]
    })
  })
})