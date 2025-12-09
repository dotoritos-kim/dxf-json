import { ShadowType } from '../consts.ts'
import type { CommonDxfEntity } from '../shared.ts'

/**
 * Describes a sun light source in AutoCAD.
 *
 * @note SunEntity doesn't have `layer`, but for compatibility, we put empty string `''`
 */
export interface SunEntity extends CommonDxfEntity {
  /** Parsed by group code `0` */
  type: 'SUN'
  /**
   * Although `SUN` is type of `ENTITY`, **it NEVER has `layer`**, which conflicts
   * the official specification of common entity.
   *
   * We're not sure other ENTITY may have same issue. So temporarily, we put
   * `''` as fallback. You SHOULD NOT access this field.
   *
   * @deprecated This field may be removed at the major update in future, by changing `CommonDxfEntity` type.
   */
  layer: ''
  /** Parsed by group code `100` */
  subclassMarker: 'AcDbSun'
  /** Parsed by group code `90` */
  version: number
  /** Parsed by group code `290` */
  isOn: boolean
  /**
   * Indicates the color of sunlight in Autocad Color Index.
   * If `lightColorInstance` exists, this represents the most simliar ACI color.
   *
   * Parsed by group code `63`
   */
  lightColorIndex: number
  /**
   * Inidicates the color of sunlight in rgb integer type.
   * This exists when user defined light color cannot be represented in ACI.
   *
   * Parsed by group code `421`
   *
   * Also this is not related to common entity color defined by group code `420`.
   *
   * @note This property is not described in official document.
   * */
  lightColorInstance?: number
  /** Parsed by group code `40` */
  intensity: number
  /** Parsed by group code `291` */
  hasShadow: boolean
  /**
   * Indicates the position of sun as time, where unit is in Julian day number.
   * You may add `time` to get exact position in time.
   *
   * Blame the freakin dude who decided to use julian day to represent the
   * position of sun.
   *
   * Parsed by group code `91`
   */
  julianDay: number
  /**
   * Indicates the position of sun as time (in milliseconds),
   * on a day specified by `julianDay`.
   *
   * Parsed by group code `92`
   */
  time: number
  /**
   * Indicates whether the the position described by `julianDay` and `time`
   * is represented in daylight saving (summer time) or not.
   *
   * Parsed by group code `292`
   */
  isSummerTime: boolean
  /** Parsed by group code `70` */
  shadowType: ShadowType
  /** Parsed by group code `71` */
  shadowMapSize: number
  /** Parsed by group code `280` */
  shadowMapSoftness: number
}
