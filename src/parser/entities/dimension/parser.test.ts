import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { AttachmentPoint } from '../../../consts/dimension';
import { DxfArrayScanner } from '../../DxfArrayScanner'
import { DimensionParser } from './parser'
import type { 
  AlignedDimensionEntity, 
  AngularDimensionEntity, 
  OrdinateDimensionEntity, 
  RadialDiameterDimensionEntity 
} from './types';


describe('DIMENSION', () => {
  test('AcDbAlignedDimension - Linear', () => {
    const content = readFileSync(join(__dirname, './linear.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new DimensionParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'DIMENSION'

    expect(entity).toMatchObject<AlignedDimensionEntity>({
      type: 'DIMENSION',
      subclassMarker: 'AcDbAlignedDimension',
      handle: '2BA',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D1',
      definitionPoint: { x: 50, y: 70, z: 0 },
      textPoint: { x: 25, y: 71, z: 0 },
      dimensionType: 32,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 50,
      styleName: 'ISO-25',
      subDefinitionPoint1: { x: 0, y: 0, z: 0 },
      subDefinitionPoint2: { x: 50, y: 50, z: 0 },
      rotationAngle: 30,
      obliqueAngle: 45,
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
    })
  })

  test('AcDb3PointAngularDimension', () => {
    const content = readFileSync(join(__dirname, './angular3p.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new DimensionParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'DIMENSION'

    expect(entity).toMatchObject<AngularDimensionEntity>({
      type: 'DIMENSION',
      subclassMarker: 'AcDb3PointAngularDimension',
      handle: '2D8',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D3',
      definitionPoint: { x: 207, y: 39, z: 0 },
      textPoint: { x: 200, y: 41, z: 0 },
      dimensionType: 37,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 1,
      styleName: 'ISO-25',
      subDefinitionPoint1: { x: 180, y: 30, z: 0 },
      subDefinitionPoint2: { x: 220, y: 30, z: 0 },
      centerPoint: { x: 200, y: 0, z: 0 },
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
    })
  })

  test('AcDb2LineAngularDimension', () => {
    const content = readFileSync(join(__dirname, './angular-tc1.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new DimensionParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'DIMENSION'

    expect(entity).toMatchObject<AngularDimensionEntity>({
      type: 'DIMENSION',
      subclassMarker: 'AcDb2LineAngularDimension',
      handle: '2C3',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D2',
      definitionPoint: { x: 0, y: 0, z: 0 },
      textPoint: { x: 50, y: 20, z: 0 },
      dimensionType: 34,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 1,
      styleName: 'ISO-25',
      subDefinitionPoint1: { x: 0, y: 0, z: 0 },
      subDefinitionPoint2: { x: 50, y: 0, z: 0 },
      centerPoint: { x: 50, y: 50, z: 0 },
      arcPoint: { x: 48, y: 12, z: 0 },
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
      extensions: {
        ACAD_XDICTIONARY: [{ code: 360, value: '2D1' }],
        ACAD_REACTORS: [{ code: 330, value: '2DB' }]
      }
    })
  })

  test('AcDbAlignedDimension - Aligned', () => {
    const content = readFileSync(join(__dirname, './aligned.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new DimensionParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'DIMENSION'

    expect(entity).toMatchObject<AlignedDimensionEntity>({
      type: 'DIMENSION',
      subclassMarker: 'AcDbAlignedDimension',
      handle: '2C8',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D2',
      definitionPoint: { x: 140, y: 60, z: 0 },
      textPoint: { x: 113, y: 36, z: 0 },
      dimensionType: 33,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 70,
      styleName: 'ISO-25',
      subDefinitionPoint1: { x: 100, y: 0, z: 0 },
      subDefinitionPoint2: { x: 150, y: 50, z: 0 },
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
      DIMSCALE: 2,
    })
  })

  test('AcDbDiametricDimension', () => {
    const content = readFileSync(join(__dirname, './diametric.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new DimensionParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'DIMENSION'

    expect(entity).toMatchObject<RadialDiameterDimensionEntity>({
      type: 'DIMENSION',
      subclassMarker: 'AcDbDiametricDimension',
      handle: '349',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D6',
      definitionPoint: { x: 500, y: -30, z: 0 },
      textPoint: { x: 500, y: 50, z: 0 },
      dimensionType: 163,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 60,
      styleName: 'ISO-25',
      subDefinitionPoint: { x: 500, y: 30, z: 0 },
      leaderLength: 0,
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
      extensions: {
        ACAD_XDICTIONARY: [
          {
            code: 360,
            value: '355',
          },
        ],
        ACAD_REACTORS: [
          {
            code: 330,
            value: '35E',
          }
        ]
      }
    })
  })

  test('AcDbOrdinateDimension', () => {
    const content = readFileSync(join(__dirname, './ordinate.partial_dxf'), 'utf-8')
    const scanner = new DxfArrayScanner(content.split('\n'))
    const parser = new DimensionParser()

    let curr = scanner.next() 
    curr = scanner.next() // skip first line
    const entity = parser.parseEntity(scanner, curr)
    entity.type = 'DIMENSION'

    expect(entity).toMatchObject<OrdinateDimensionEntity>({
      type: 'DIMENSION',
      subclassMarker: 'AcDbOrdinateDimension',
      handle: '37A',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      version: 0,
      name: '*D8',
      definitionPoint: { x: 0, y: 0, z: 0 },
      textPoint: { x: 581, y: 21, z: 0 },
      dimensionType: 38,
      attachmentPoint: AttachmentPoint.MiddleCenter,
      measurement: 0,
      styleName: 'ISO-25',
      subDefinitionPoint1: { x: 550, y: 0, z: 0 },
      subDefinitionPoint2: { x: 580, y: 20, z: 0 },
      DIMTIH: 0,
      DIMTOH: 0,
      DIMSE1: 0,
    })
  })
})