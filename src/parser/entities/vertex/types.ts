import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'
import type { VertexFlag } from './consts.ts'

export interface VertexEntity extends CommonDxfEntity, Point3D {
  subclassMarker: 'AcDb2dVertex' | 'AcDb3dPolylineVertex'
  startWidth: number
  endWidth: number
  bulge: number
  flag: VertexFlag
  tangentDirection: number
  polyfaceIndex0?: number
  polyfaceIndex1?: number
  polyfaceIndex2?: number
  polyfaceIndex3?: number
  id: number
}
