import type { OrthographicType } from '../../../consts/viewport.ts'
import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfTableEntry } from '../types.ts'

/**
 * Table entry represents User Coordinate System (UCS)
 */
export interface CommonUcsTableEntry extends CommonDxfTableEntry {
  /**
   * Parsed by group code `100`
   */
  subclassMarker: 'AcDbUCSTableRecord'
  /**
   * Name of the UCS
   *
   * Parsed by group code `2`
   * */
  name: string
  /**
   * Bitwise combination of `TableEntryDependencyFlag` which indicates xref status.
   *
   * Parsed by group code `70`.
   *
   * @see TableEntryDependencyFlag
   */
  flag: number
  /**
   * Origin (in WCS)
   *
   * Parsed by group codes `10`, `20`, `30`
   */
  origin: Point3D
  /**
   * X-axis direction (in WCS)
   *
   * Parsed by group codes `11`, `21`, `31`
   */
  xAxis: Point3D
  /**
   * Y-axis direction (in WCS)
   *
   * Parsed by group codes `12`, `22`, `32`
   */
  yAxis: Point3D
  /**
   * Elevation of UCS
   *
   * Parsed by group code `146`
   */
  elevation: number
  /**
   * Indicates whether this UCS is orthographic.
   *
   * For some unknown reason, the document of AutoCAD says this is always 0 (`false` in dxf-json),
   * but we don't assume this so that it may have `true`
   *
   * Parsed by group code `79`
   */
  isOrthographic?: boolean
  /**
   * ID/handle of base UCS if this is an orthographic.
   *
   * By the official document, if `isOrthographic` is not `true`, this is always `undefined.
   *
   * If this is `undefined` and `isOrthographic` is `true`, then base UCS is assumed to be WORLD
   *
   * Parsed by group code `346`
   */
  baseUcsHandle?: string
  /**
   * Type of orthographic UCS
   *
   * Parsed by group code `71`
   */
  orthographicType?: OrthographicType
  /**
   * Origin for this orthographic type relative to this  UCS
   *
   * Parsed by group codes `13`, `23`, `33`
   */
  orthographicOrigin?: Point3D
}

export interface NonOrthographicUcsTableEntry extends CommonUcsTableEntry {
  /**
   * Indicates whether this UCS is orthographic.
   *
   * For some unknown reason, the document of AutoCAD says this is always 0 (`false` in dxf-json),
   * but we don't assume this so that it may have `true`
   *
   * Parsed by group code `79`
   */
  isOrthographic?: false
  orthographicType?: undefined
  orthographicOrigin?: undefined
}

export interface OrthographicUcsTableEntry extends CommonUcsTableEntry {
  /**
   * Indicates whether this UCS is orthographic.
   *
   * For some unknown reason, the document of AutoCAD says this is always 0 (`false` in dxf-json),
   * but we don't assume this so that it may have `true`
   *
   * Parsed by group code `79`
   */
  isOrthographic: true
  /**
   * Type of orthographic UCS
   *
   * Parsed by group code `71`
   */
  orthographicType: OrthographicType
  /**
   * Origin for this orthographic type relative to this UCS
   *
   * Parsed by group codes `13`, `23`, `33`
   */
  orthographicOrigin: Point3D
}

/**
 * Table entry represents User Coordinate System (UCS)
 *
 * You can distinguish whether this is `OrthographicUcsTableEntry` or not by checking `isOrthographic`.
 *
 * @see NonOrthographicUcsTableEntry
 * @see OrthographicUcsTableEntry
 */
export type UcsTableEntry =
  | NonOrthographicUcsTableEntry
  | OrthographicUcsTableEntry
