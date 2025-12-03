import type { Point2D, Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface LWPolylineEntity extends CommonDxfEntity {
  type: 'LWPOLYLINE'
  subclassMarker: 'AcDbPolyline'
  numberOfVertices: number
  flag: number
  constantWidth?: number
  elevation: number
  thickness: number
  extrusionDirection: Point3D
  vertices: LWPolylineVertex[]
}

export interface LWPolylineVertex extends Point2D {
  id: number
  startWidth?: number
  endWidth?: number
  bulge: number
}
