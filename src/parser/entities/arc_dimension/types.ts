import type { Point3D } from "../../../types";
import type { DimensionEntityCommon } from "../dimension";

/**
 * `ARC_DIMENSION` was introduced in DXF R2004 and is not documented in DXF reference.
 * Still there are C++ API documentation, so I referred to it mostly along other
 * open source like ezdxf.
 * 
 * It's separated ENTITY type but it shares many portion of `DIMENSION`.
 * 
 * `dimensionType` of `ARC_DIMENSION` can have `5` or `8` under `0xf` bitmask.
 * It varies to DXF version.
 * 
 * @extends DimensionEntityCommon
 */
export interface ArcDimensionEntity extends Omit<DimensionEntityCommon, 'type'> {
  type: 'ARC_DIMENSION'
  /** Parsed by group code `100` */
  subclassMarker: 'AcDbArcDimension'
  /**
   * The start point for the arc length dimension's first extension line.
   * 
   * Parsed by group code `13`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__xLine1Point
   */
  xline1Point: Point3D
  /**
   * The start point for the arc length dimension's second extension line.
   * 
   * Parsed by group code `14`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__xLine2Point
   */
  xline2Point: Point3D
  /**
   * The center point of the arc dimensioned by the arc length dimension.
   * 
   * Parsed by group code `15`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__centerPoint
   */
  centerPoint: Point3D
  /**
   * It exists in C++ documentation, but doesn't have any usage currently. Reserved for future use.
   * 
   * Parsed by group code `70`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__isPartial
   */
  isPartial: boolean
  /**
   * The parameter of the arc being dimensioned corresponding to the arc length dimension's first definition point.
   * 
   * Parsed by group code `41`.
   * 
   * @note The unit is radian
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__arcStartParam
   */
  startAngle: number
  /**
   * The parameter of the arc being dimensioned corresponding to the arc length dimension's second definition point.
   * 
   * Parsed by group code `42`.
   * 
   * @note The unit is radian
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__arcEndParam
   */
  endAngle: number
  /**
   * Indicates the existence of extra leader of this entity.
   * 
   * - `true` if this arc length dimension has an extra leader drawn to resolve ambiguity.
   * - `false` if the arc length dimension has no extra leader drawn.
   * 
   * Note that `leaderStart` and `leaderEnd` exist even if this is `false`.
   * 
   * Parsed by group code `71`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__hasLeader
   */
  hasLeader: boolean
  /**
   * Sets the start point for the arc length dimension's extra leader, if drawn.
   * 
   * Parsed by group code `16`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__setLeader1Point_AcGePoint3d__
   */
  leaderStart: Point3D
  /**
   * Sets the end point for the arc length dimension's extra leader, if drawn.
   * 
   * Parsed by group code `17`.
   * 
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbArcDimension__setLeader2Point_AcGePoint3d__
   */
  leaderEnd: Point3D
}