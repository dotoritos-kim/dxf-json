import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface SolidEntity extends CommonDxfEntity {
  type: 'SOLID'
  subclassMarker: 'AcDbTrace'
  points: Point3D[]
  thickness: number
  extrusionDirection: Point3D
}
