import { OrthographicType, RenderMode } from '../../../consts/viewport.ts'
import type { Point2D, Point3D } from '../../../types/shared.ts'
import type { CommonDxfTableEntry } from '../types.ts'

export interface ViewTableEntry extends CommonDxfTableEntry {
  /**
   * Parsed by group code `100`
   */
  subclassMarker: 'AcDbViewTableRecord'
  /**
   * Name of view
   *
   * Parsed by group code `2`
   */
  name: string
  /**
   * Bitwise combination of `ViewFlag` and `TableEntryDependencyFlag`.
   *
   * Parsed by group code `70`.
   *
   * @see ViewFlag
   * @see TableEntryDependencyFlag
   */
  flag: number
  /**
   * View height in DCS
   *
   * Parsed by group code `40`
   */
  height: number
  /** View width in DCS
   *
   * Parsed by group code `41`
   */
  width: number
  /**
   * Center point of view in DCS
   *
   * Parsed by group codes `10` and `20`
   */
  center: Point2D
  /**
   * View direction from target
   *
   * Parsed by group codes `11`, `21`, and `31`
   */
  direction: Point3D
  /**
   * Target point
   *
   * Parsed by group codes `12`, `22`, and `32`
   */
  target: Point3D
  /** Parsed by group code `42` */
  lensLength: number
  /** Parsed by group code `43` */
  frontClippingPlane: number
  /** Parsed by group code `44` */
  backClippingPlane: number
  /** Parsed by group code `50` */
  twistAngle: number
  /**
   * Bitwise combination of `ViewMode` indicates the current view mode.
   *
   * Related to `$VIEWMODE` system variable
   *
   * Parsed by group code `71`
   *
   * @see ViewMode
   */
  viewMode: number
  /**
   * Parsed by group code `281`
   * */
  renderMode: RenderMode
  /** Parsed by group code `72` */
  isUcsAssociated: boolean
  /** Parsed by group code `73` */
  isPlottable: boolean
  /** Parsed by group code `332` */
  backgroundSoftId?: string
  /** Parsed by group code `334` */
  liveSectionSoftId?: string
  /** Parsed by group code `348` */
  styleHardId?: string
  /** Parsed by group code `361` */
  sunHardId?: string
  /**
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group codes `110`, `120`, and `130`
   */
  ucsOrigin?: Point3D
  /**
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group codes `111`, `121`, and `131`
   */
  ucsXAxis?: Point3D
  /**
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group codes `112`, `122`, and `132`
   */
  ucsYAxis?: Point3D
  /**
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group code `79`
   */
  orthographicType?: OrthographicType
  /**
   * UCS elevation
   *
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group code `146`
   */
  elevation?: number
  /**
   * If the associated UCS is named, ID/handle of `UcsTableEntry`.
   * Otherwise `undefined`.
   *
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group code `345`
   */
  ucsId?: string
  /**
   * ID/handle of `OrthographicUcsTableEntry` as base UCS.
   *
   * If this is `undefined` and `orthographicType` is defined,
   * then base UCS is assumed to be WORLD.
   *
   * Appears only if `isUcsAssociated` is `true`.
   *
   * Parsed by group code `346`
   */
  baseUcsId?: string
}
