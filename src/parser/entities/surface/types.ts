import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface SurfaceEntityBase extends CommonDxfEntity {
  subclassMarker: 'AcDbSurface'
  /** Modeler format version number (DXF R2010 and before) */
  version?: number
  /** Proprietary (ACIS) data. Absent in R2013+ (stored in AcDsData section) */
  data?: string
  /** Group 290 of AcDbModelerGeometry */
  hasRevisionGuid?: boolean
  /** Revision GUID (group 2 of AcDbModelerGeometry) */
  guid?: string
  /** Soft-owner ID/handle to history object */
  historyObjectSoftId?: string
  /** Number of U isolines */
  uIsolineCount: number
  /** Number of V isolines */
  vIsolineCount: number
}

export interface SurfaceEntity extends SurfaceEntityBase {
  type: 'SURFACE'
}

export interface PlaneSurfaceEntity extends SurfaceEntityBase {
  type: 'PLANESURFACE'
  surfaceSubclassMarker?: 'AcDbPlaneSurface'
  classId?: number
}

export interface NurbSurfaceEntity extends SurfaceEntityBase {
  type: 'NURBSURFACE'
  surfaceSubclassMarker?: string
}

export interface SweepOptions {
  draftAngle?: number
  draftStartDistance?: number
  draftEndDistance?: number
  twistAngle?: number
  scaleFactor?: number
  alignAngle?: number
  /** 4x4 matrix (16 values) */
  sweepEntityTransform?: number[]
  /** 4x4 matrix (16 values) */
  pathEntityTransform?: number[]
  isSolid?: boolean
  /**
   * 0 = No alignment, 1 = Align sweep entity to path,
   * 2 = Translate sweep entity to path, 3 = Translate path to sweep entity
   */
  sweepAlignment?: number
  isAlignedToStart?: boolean
  isBanked?: boolean
  isBasePointSet?: boolean
  isSweepEntityTransformComputed?: boolean
  isPathEntityTransformComputed?: boolean
  referenceVectorForTwist?: Point3D
}

export interface ExtrudedSurfaceEntity extends SurfaceEntityBase, SweepOptions {
  type: 'EXTRUDEDSURFACE'
  surfaceSubclassMarker: 'AcDbExtrudedSurface'
  classId: number
  sweepEntityDataSize: number
  /** Binary data (hex) of the sweep entity */
  sweepEntityData: string
  sweepVector: Point3D
  /** 4x4 transform matrix (16 values) */
  transform: number[]
}

export interface SweptSurfaceEntity extends SurfaceEntityBase, SweepOptions {
  type: 'SWEPTSURFACE'
  surfaceSubclassMarker: 'AcDbSweptSurface'
  sweepEntityId: number
  sweepEntityDataSize: number
  sweepEntityData: string
  pathEntityId: number
  pathEntityDataSize: number
  pathEntityData: string
  sweepEntityTransformMatrix: number[]
  pathEntityTransformMatrix: number[]
}

export interface RevolvedSurfaceEntity extends SurfaceEntityBase {
  type: 'REVOLVEDSURFACE'
  surfaceSubclassMarker: 'AcDbRevolvedSurface'
  revolveEntityId: number
  revolveEntityDataSize: number
  revolveEntityData: string
  axisPoint: Point3D
  axisVector: Point3D
  revolveAngle: number
  startAngle: number
  /** 4x4 transform matrix (16 values) */
  transform: number[]
  draftAngle?: number
  draftStartDistance?: number
  draftEndDistance?: number
  twistAngle?: number
  isSolid?: boolean
  isCloseToAxis?: boolean
}

export interface LoftedSurfaceEntity extends SurfaceEntityBase {
  type: 'LOFTEDSURFACE'
  surfaceSubclassMarker: 'AcDbLoftedSurface'
  /** 4x4 transform matrix (16 values) */
  transform: number[]
  /** Cross sections / guides / path entities as raw binary blobs */
  entityData?: { size: number; data: string }[]
  /** 0 = No plane normal, 1 = First, 2 = Last, 3 = Both, 4 = All */
  planeNormalLoftingType?: number
  startDraftAngle?: number
  endDraftAngle?: number
  startDraftMagnitude?: number
  endDraftMagnitude?: number
  isArcLengthParameterization?: boolean
  isNoTwist?: boolean
  isAlignDirection?: boolean
  isSimpleSurfaces?: boolean
  isClosed?: boolean
  isRuled?: boolean
  isVirtualGuide?: boolean
}

export type AnySurfaceEntity =
  | SurfaceEntity
  | PlaneSurfaceEntity
  | NurbSurfaceEntity
  | ExtrudedSurfaceEntity
  | SweptSurfaceEntity
  | RevolvedSurfaceEntity
  | LoftedSurfaceEntity
