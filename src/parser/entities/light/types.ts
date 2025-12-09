import type { Point3D } from '../../../types/shared.ts'
import type { ShadowType } from '../consts.ts'
import type { CommonDxfEntity } from '../shared.ts'
import type { AttenuationType, LightType } from './consts.ts'

export interface LightEntity extends CommonDxfEntity {
  /** Parsed by group code `100` */
  subclassMarker: 'AcDbLight'
  /** Parsed by group code `90` */
  version: number
  /** Parsed by group code `1` */
  name: string
  /** Parsed by group ode `70` */
  lightType: LightType
  /**
   * Indicates the color of light in Autocad Color Index.
   * If `lightColorInstance` exists, this represents the most simliar ACI color.
   *
   * Parsed by group code `63`
   *
   * @note This property is not described in official document.
   */
  lightColorIndex: number
  /**
   * Inidicates the color of light in rgb integer type.
   * This exists when user defined light color cannot be represented in ACI.
   *
   * Parsed by group code `421`
   *
   * Also this is not related to common entity color defined by group code `420`.
   *
   * @note This property is not described in official document.
   * */
  lightColorInstance?: number
  /** Parsed by group code `290` */
  isOn: boolean
  /** Parsed by group code `291` */
  isPlotGlyph: boolean
  /** Parsed by group code `40` */
  intensity: number
  /** Parsed by group code `10`, `20`, `30` */
  position: Point3D
  /** Parsed by group code `11`, `21`, `31` */
  target: Point3D
  /** Parsed by group code `72` */
  attenuationType: AttenuationType
  /** Parsed by group code `292` */
  isAttenuationLimited: boolean
  /**
   * This exist even `isAttenuationLimited` is `false`
   *
   * Parsed by group code `41`
   * */
  limitStart: number
  /** Parsed by group code `42` */
  limitEnd: number
  /** Parsed by group code `50` */
  hotspotAngle: number
  /** Parsed by group code `51` */
  falloffAngle: number
  /** Parsed by group code `293` */
  isShadowCast: boolean
  /** Parsed by group code `73` */
  shadowType: ShadowType
  /** Parsed by group code `91` */
  shadowMapSize: number
  /** Parsed by group code `280` */
  shadowMapSoftness: number
}
