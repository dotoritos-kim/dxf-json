import type { Point3D } from '../../types/shared.ts'
import type { CommonDxfEntity } from '../entities/shared.ts'

export interface DxfBlock {
  type: number // bit flag of BlockTypeFlag
  name: string
  name2: string
  handle: string
  ownerHandle: string
  layer: string
  position: Point3D
  paperSpace: boolean
  xrefPath: string
  entities?: CommonDxfEntity[]
}
