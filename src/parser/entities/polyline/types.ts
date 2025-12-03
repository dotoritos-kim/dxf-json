import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'
import type { VertexEntity } from '../vertex/types.ts'
import type { SmoothType } from './consts.ts'

export interface PolylineEntity extends CommonDxfEntity {
  type: 'POLYLINE'
  subclassMarker: 'AcDb2dPolyline | AcDb3dPolyline'
  thickness: number
  flag: number
  startWidth: number
  endWidth: number
  meshMVertexCount: number
  meshNVertexCount: number
  surfaceMDensity: number
  surfaceNDensity: number
  smoothType: SmoothType
  extrusionDirection: Point3D
  vertices: VertexEntity[]
}
