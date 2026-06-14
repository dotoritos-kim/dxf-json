import type { CommonDXFObject } from '../types.ts'

/**
 * One MLINESTYLE element definition.
 */
export interface MLineStyleElement {
  /**
   * Group code 49: element offset.
   */
  offset?: number

  /**
   * Group code 420: element true color.
   */
  color?: number

  /**
   * Group code 62: element color index (ACI).
   */
  colorIndex?: number

  /**
   * Group code 6: element linetype name.
   */
  lineType?: string
}

/**
 * MLINESTYLE object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-3EC12E5B-F5F6-484D-880F-D69EBE186D79.htm
 */
export interface MLineStyleDXFObject extends CommonDXFObject {
  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbMlineStyle`.
   */
  subclassMarker: 'AcDbMlineStyle'

  /**
   * Group code 2: MLINE style name.
   *
   * This is redundant with the dictionary key (group code 3 in the
   * MLINESTYLE dictionary entry) and should be treated as read-only.
   */
  styleName?: string

  /**
   * Group code 70: style flags (bit-coded).
   *
   * Bit values:
   * - 1: fill on
   * - 2: display miters
   * - 16: start square end (line) cap
   * - 32: start inner arcs cap
   * - 64: start round (outer arcs) cap
   * - 256: end square (line) cap
   * - 512: end inner arcs cap
   * - 1024: end round (outer arcs) cap
   */
  flags?: number

  /**
   * Group code 3: style description string.
   * Maximum length is 255 characters in DXF spec.
   */
  description?: string

  /**
   * Group code 420: fill true color.
   */
  fillColor?: number

  /**
   * Group code 62: fill color index (ACI).
   * Default in spec is 256 (BYLAYER).
   */
  fillColorIndex?: number

  /**
   * Group code 51: start angle.
   * DXF writes angle values in degrees.
   */
  startAngle?: number

  /**
   * Group code 52: end angle.
   * DXF writes angle values in degrees.
   */
  endAngle?: number

  /**
   * Group code 71: number of line elements in this style.
   */
  elementCount?: number

  /**
   * Group codes 49/62/420/6: per-element definitions.
   */
  elements?: MLineStyleElement[]
}
