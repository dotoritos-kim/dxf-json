import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface SectionEntity extends CommonDxfEntity {
  type: 'SECTION'
  subclassMarker: 'AcDbSection'
  state: number
  flag: number
  name: string
  verticalDirection: Point3D
  topHeight: number
  bottomHeight: number
  indicatorTransparency: number
  indicatorColor: number
  numberOfVertices: number
  vertices: Point3D[]
  numberOfBackLineVertices: number
  backLineVertices: Point3D[]
  geometrySettingHardId: string
}
