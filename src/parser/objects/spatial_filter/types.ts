import type { Point2D, Point3D } from '../../../types'
import type { CommonDXFObject } from '../types'

export interface SpatialFilterDXFObject extends CommonDXFObject {
  subclassMarker: 'AcDbSpatialFilter'
  /**
   * Number of points on the clip boundary
   * 2 = Rectangular clip boundary (lower-left and upper-right)
   * greater than 2 = Polyline clip boundary
   * */
  boundaryCount: number
  /** Clip boundary definition point (in OCS) (always 2 or more) based on an xref scale of 1 */
  boundaryVertices: Point2D[]
  /** Normal to the plane containing the clip boundary */
  normal: Point3D
  /** Origin used to define the local coordinate system of the clip boundary */
  position: Point3D
  /** Clip boundary display enabled flag */
  isClipBoundaryDisplayed: boolean
  isFrontClipping: boolean
  /** Front clipping plane distance (if code `isFrontClipping` is `true`) */
  frontClippingDistance?: number
  isBackClipping: boolean
  /** Back clipping plane distance (if code `isBackClipping` is `true`) */
  backClippingDistance?: number
  /**
   * 4x3 transformation matrix written out in column major order.
   * This matrix transforms points into the coordinate system of the clip boundary (12 entries)
   */
  wcsToOCSTransform: number[][]
  /**
   * 4x3 transformation matrix written out in column major order.
   * This matrix is the inverse of the original block reference (insert entity)
   * transformation. The original block reference transformation is
   * the one that is applied to all entities in the block when
   * the block reference is regenerated (always 12 entries)
   * */
  ocsToWCSTransform: number[][]
}
