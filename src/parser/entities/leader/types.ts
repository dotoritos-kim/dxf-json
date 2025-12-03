import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'
import type { LeaderCreationFlag } from './consts.ts'

export interface LeaderEntity extends CommonDxfEntity {
  type: 'LEADER'
  subclassMarker: 'AcDbLeader'
  styleName: string
  isArrowheadEnabled: boolean
  isSpline: boolean
  leaderCreationFlag: LeaderCreationFlag
  isHooklineSameDirection: boolean
  isHooklineExists: boolean
  textHeight?: number
  textWidth?: number
  numberOfVertices?: number
  vertices: Point3D[]
  byBlockColor?: number
  associatedAnnotation?: string
  normal?: Point3D
  horizontalDirection?: Point3D
  offsetFromBlock?: Point3D
  offsetFromAnnotation?: Point3D
}
