import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface PointEntity extends CommonDxfEntity {
  type: 'POINT'
  position: Point3D
  thickness: number
  extrusionDirection: Point3D
  angle: number
}
