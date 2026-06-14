import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface ShapeEntity extends CommonDxfEntity {
  type: 'SHAPE'
  subclassMarker: 'AcDbShape'
  thickness: number
  insertionPoint: Point3D
  size: number
  shapeName: string
  rotation: number
  xScale: number
  obliqueAngle: number
  extrusionDirection: Point3D
}
