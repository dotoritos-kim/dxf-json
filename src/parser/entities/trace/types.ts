import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

/**
 * TRACE entity. Same group code layout as SOLID (AcDbTrace subclass):
 * four corner points (10-13), thickness (39) and extrusion direction (210).
 */
export interface TraceEntity extends CommonDxfEntity {
  type: 'TRACE'
  subclassMarker: 'AcDbTrace'
  points: Point3D[]
  thickness: number
  extrusionDirection: Point3D
}
