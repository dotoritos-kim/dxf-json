import type { Point3D } from '../../../types/shared.ts'
import type { CommonDXFObject } from '../types.ts'

/**
 * One DIMASSOC point-reference block (`AcDbOsnapPointRef`) mapped from DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-C0B96256-A911-4B4D-85E6-EB4AF2C91E27.htm
 */
export interface DimAssocPointRef {
  /**
   * Group code 1: point-reference class name.
   * Expected value: `AcDbOsnapPointRef`.
   */
  className: 'AcDbOsnapPointRef'

  /**
   * Group code 72: Object Osnap type.
   * 0=None, 1=Endpoint, 2=Midpoint, 3=Center, 4=Node, 5=Quadrant,
   * 6=Intersection, 7=Insertion, 8=Perpendicular, 9=Tangent,
   * 10=Nearest, 11=Apparent intersection, 12=Parallel, 13=Start point.
   */
  objectOsnapType?: number

  /**
   * Group code 331: handle/ID of the main geometry object.
   */
  mainObjectId?: string

  /**
   * Group code 73: subentity type of the main object (for example, edge/face).
   */
  mainObjectSubentityType?: number

  /**
   * Group code 91: GS marker index of the main object.
   */
  mainObjectGsMarker?: number

  /**
   * Group code 301: Xref object handle string for the main object.
   */
  mainObjectXrefHandle?: string

  /**
   * Group code 40: geometry parameter used for Near Osnap.
   */
  nearOsnapGeometryParameter?: number

  /**
   * Group codes 10/20/30: Osnap point in WCS coordinates.
   * 10=X, 20=Y, 30=Z.
   */
  osnapPoint?: Point3D

  /**
   * Group code 332: handle/ID of the intersection geometry object.
   */
  intersectionObjectId?: string

  /**
   * Group code 74: subentity type of the intersection object (for example, edge/face).
   */
  intersectionObjectSubentityType?: number

  /**
   * Group code 92: GS marker index of the intersection object.
   */
  intersectionObjectGsMarker?: number

  /**
   * Group code 302: Xref object handle string for the intersection object.
   */
  intersectionObjectXrefHandle?: string
}

/**
 * DIMASSOC object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-C0B96256-A911-4B4D-85E6-EB4AF2C91E27.htm
 */
export interface DimAssocDXFObject extends CommonDXFObject {
  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbDimAssoc`.
   */
  subclassMarker: 'AcDbDimAssoc'

  /**
   * Group code 330: handle/ID of the related DIMENSION entity.
   */
  dimensionObjectId?: string

  /**
   * Group code 90: associativity bit flag.
   * 1=first point reference, 2=second, 4=third, 8=fourth.
   */
  associativityFlag?: number

  /**
   * Group code 70: trans-space flag.
   * `true` means trans-space association is enabled.
   */
  transSpaceFlag?: boolean

  /**
   * Group code 71: rotated dimension type (parallel/perpendicular).
   */
  rotatedDimensionType?: number

  /**
   * Group code 75: hasLastPointRef flag.
   * `true` means the DIMASSOC object includes the "last point reference" marker.
   */
  hasLastPointRef?: boolean

  /**
   * Group code 1 (repeated): point-reference records (`AcDbOsnapPointRef`).
   * One entry exists for each dimension association point serialized in this DIMASSOC object.
   */
  pointRefs?: DimAssocPointRef[]
}