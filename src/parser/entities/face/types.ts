import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface FaceEntity extends CommonDxfEntity {
  subclassMarker: 'AcDbFace'
  vertices: Point3D[]
  shape: number
}
