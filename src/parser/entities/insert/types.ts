import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface InsertEntity extends CommonDxfEntity {
  type: 'INSERT'
  subclassMarker: 'AcDbBlockReference'
  isVariableAttributes?: boolean
  name: string
  insertionPoint: Point3D
  xScale: number
  yScale: number
  zScale: number
  rotation: number // degree
  columnCount: number
  rowCount: number
  columnSpacing: number
  rowSpacing: number
  extrusionDirection: Point3D
}
