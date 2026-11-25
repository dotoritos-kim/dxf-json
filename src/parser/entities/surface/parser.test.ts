import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseEntities } from '../parser.ts'
import {
  ExtrudedSurfaceEntityParser,
  RevolvedSurfaceEntityParser,
  SurfaceEntityParser,
} from './parser.ts'
import type {
  ExtrudedSurfaceEntity,
  RevolvedSurfaceEntity,
  SurfaceEntity,
} from './types.ts'

const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
const zeros = Array(16).fill(0)

function scannerOf(file: string) {
  const content = readFileSync(join(__dirname, file), 'utf-8')
  return new DxfArrayScanner(content.split('\n'))
}

describe('SurfaceEntity Parser', () => {
  test('tc0: real SURFACE (R2013+, no ACIS data)', () => {
    const scanner = scannerOf('./tc0.partial_dxf')
    let curr = scanner.next()
    curr = scanner.next()
    const entity = new SurfaceEntityParser().parseEntity(scanner, curr)
    entity.type = 'SURFACE'

    expect(entity).toMatchObject<Partial<SurfaceEntity>>({
      type: 'SURFACE',
      handle: '98E3FD',
      ownerBlockRecordSoftId: '98E3F2',
      layer: 'HA-K',
      materialObjectHardId: '663A6E',
      colorIndex: 8,
      hasRevisionGuid: true,
      guid: '{91ca2de8-6656-0c49-9bcc-02ddcf2c8f71}',
      subclassMarker: 'AcDbSurface',
      uIsolineCount: 6,
      vIsolineCount: 6,
    })
    expect(entity.xdata?.map((x) => x.appName)).toEqual([
      'ACAD_MATERIAL_MAPPER',
      'ACAD_MATERIAL_MAPPER_2',
      'ACAD_STEPID',
    ])
    expect(entity).not.toHaveProperty('_code1text')
    expect(entity).not.toHaveProperty('_code3text')
    // stopped right before next entity
    expect(scanner.next()).toMatchObject({ code: 0, value: 'ENDSEC' })
  })

  test('tc1: EXTRUDEDSURFACE', () => {
    const scanner = scannerOf('./tc1.partial_dxf')
    let curr = scanner.next()
    curr = scanner.next()
    const entity = new ExtrudedSurfaceEntityParser().parseEntity(scanner, curr)

    expect(entity).toEqual<Omit<ExtrudedSurfaceEntity, 'type'>>({
      handle: 'A1',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 1,
      data: 'ACISDATA',
      subclassMarker: 'AcDbSurface',
      uIsolineCount: 2,
      vIsolineCount: 3,
      surfaceSubclassMarker: 'AcDbExtrudedSurface',
      classId: 17,
      sweepEntityDataSize: 4,
      sweepEntityData: 'AABBCCDD',
      sweepVector: { x: 0, y: 0, z: 5 },
      transform: identity,
      draftAngle: 0,
      draftStartDistance: 0,
      draftEndDistance: 0,
      twistAngle: 0,
      scaleFactor: 1,
      alignAngle: 0,
      sweepEntityTransform: zeros,
      pathEntityTransform: zeros,
      isSolid: false,
      sweepAlignment: 2,
      isAlignedToStart: true,
      isBanked: false,
      isBasePointSet: false,
      isSweepEntityTransformComputed: true,
      isPathEntityTransformComputed: true,
      referenceVectorForTwist: { x: 1, y: 0, z: 0 },
    })
  })

  test('tc1: REVOLVEDSURFACE via parseEntities', () => {
    const scanner = scannerOf('./tc1.partial_dxf')
    const entities = parseEntities(scanner.next(), scanner)

    expect(entities.map((e) => e.type)).toEqual([
      'EXTRUDEDSURFACE',
      'REVOLVEDSURFACE',
    ])
    expect(entities[1]).toMatchObject<Partial<RevolvedSurfaceEntity>>({
      handle: 'A2',
      hasRevisionGuid: false,
      guid: '{00000000-0000-0000-0000-000000000000}',
      surfaceSubclassMarker: 'AcDbRevolvedSurface',
      revolveEntityId: 23,
      revolveEntityDataSize: 2,
      revolveEntityData: 'EEFF',
      axisPoint: { x: 1, y: 2, z: 3 },
      axisVector: { x: 0, y: 0, z: 1 },
      revolveAngle: 3.14,
      startAngle: 0.5,
      transform: identity,
      isSolid: true,
      isCloseToAxis: false,
    })
  })

  test('RevolvedSurfaceEntityParser is registered by name', () => {
    expect(RevolvedSurfaceEntityParser.ForEntityName).toBe('REVOLVEDSURFACE')
  })
})
