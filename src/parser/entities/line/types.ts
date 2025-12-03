import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface LineEntity extends CommonDxfEntity {
  type: 'LINE'
  subclassMarker: 'AcDbLine'
  thickness: number
  startPoint: Point3D
  endPoint: Point3D
  extrusionDirection: Point3D
}
