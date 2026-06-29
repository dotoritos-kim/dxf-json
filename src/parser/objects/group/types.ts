import type { CommonDXFObject } from '../types.ts'

/**
 * GROUP object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-5F1372C4-37C8-4056-9303-EE1715F58E67
 */
export interface GroupDXFObject extends CommonDXFObject {
  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbGroup`.
   */
  subclassMarker: 'AcDbGroup'

  /**
   * Group code 300: user-visible group description text.
   */
  description?: string

  /**
   * Group code 70: unnamed flag.
   * `true` means unnamed (DXF value 1), `false` means named (DXF value 0).
   */
  isUnnamed?: boolean

  /**
   * Group code 71: selectability flag.
   * `true` means selectable (DXF value 1), `false` means not selectable (DXF value 0).
   */
  isSelectable?: boolean

  /**
   * Group code 340 (repeated): hard-pointer handles to member entities.
   * One handle is written for each entity included in this group.
   */
  entityIds?: string[]
}
