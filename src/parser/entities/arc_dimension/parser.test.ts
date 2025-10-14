import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner'
import { ArcDimensionParser } from './parser'
import type { ArcDimensionEntity } from './types';
import { AttachmentPoint } from '../../../consts';

describe('ARC_DIMENSION', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8');
    const scanner = new DxfArrayScanner(content.split('\n'));
    const parser = new ArcDimensionParser()

    let curr = scanner.next()
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'ARC_DIMENSION'

    expect(entity).toMatchObject<ArcDimensionEntity>({
      type: 'ARC_DIMENSION',
      subclassMarker: 'AcDbArcDimension',
      handle: '3D5',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D11',
      definitionPoint: { x: 306, y: 44, z: 0 },
      textPoint: { x: 300, y: 46, z: 0 },
      dimensionType: 37,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 42,
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
      styleName: 'ISO-25',
      xline1Point: { x: 280, y: 30, z: 0 },
      xline2Point: { x: 320, y: 30, z: 0 },
      centerPoint: { x: 300, y: 0, z: 0},
      isPartial: false,
      startAngle: 2,
      endAngle: 0,
      hasLeader: false,
      leaderStart: { x: 280, y: 30, z: 0 },
      leaderEnd: { x: 320, y: 30, z: 0 },
    })
  })
})