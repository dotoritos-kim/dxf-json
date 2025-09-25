import type { Point3D } from "../../../types"
import type { CommonDxfEntity } from "../shared"
import type { MLineJustification } from "./consts"

/**
 * MLINE describes parallel lines along defined segments.
 * It can define line pattern similar to LINETYPE, but it's independent to that.
 * 
 * `MLineEntity` is composed of `MLineSegment` which defines position and direction.
 * `MLineSegment` contains multiple `MLineElement` which defines actual visible lines.
 *
 * MLINE seems to be removed from AutoCAD 2025 GUI, but it's still supported.
 */
export interface MLineEntity extends CommonDxfEntity {
  type: 'MLINE'
  /** Parsed by group code `100` */
  subclassMarker: 'AcDbMline'
  /**
   * String of up to 32 characters. The name of the style used for this mline. 
   * 
   * An entry for this style must exist in the `MLINESTYLE` dictionary.
   * 
   * Do not modify this field without also updating the associated entry 
   * in the `MLINESTYLE` dictionary. 
   * 
   * @note These groups should not be modified under any circumstances, 
   * although it is safe to read them and use their values.
   * The correct fields to modify are as follows:
   *
   * - MLINE: The `340` group(=`styleObjectHandle`) in the same object, 
   *          which indicates the proper `MLINESTYLE` object.
   * - MLINESTYLE: The `3` group value in the `MLINESTYLE` dictionary, 
   *               which precedes the `350` group that has the handle or 
   *               entity name of the current `MLINESTYLE`.
   *
   * Parsed by group code `2`
   */
  name: string
  /** 
   * Pointer-handle/ID of `MLINESTYLE` object
   * 
   * Parsed by group code `340`
   * */
  styleObjectHandle: string
  /** Parsed by group code `40` */
  scale: number
  /** Parsed by group code `70` */
  justification: MLineJustification
  /** 
   * Bitwise combination of `MLineFlags`
   * 
   * Parsed by group code `71`
   * 
   * @see MLineFlags
   */
  flags: number
  /** Parsed by group code `72` */
  vertexCount: number
  /** 
   * Number of elements in `MLINESTYLE` definition 
   * 
   * Parsed by group code `73`
   */
  styleCount: number
  /**
   * Start point (in WCS)
   * 
   * Parsed by group code `10`
   */
  startPosition: Point3D
  /**
   * Parsed by group code `210`
   */
  extrusionDirection: Point3D
  segments?: MLineSegment[]
}

export interface MLineSegment {
  /** 
   * Vertex coordinate (in WCS)
   * 
   * Parsed by group code `11`
   * */
  position: Point3D
  /** 
   * Direction vector of segment starting at this vertex.
   * 
   * Parsed by group code `12`
   * */
  direction: Point3D
  /** 
   * Direction vector of miter (joint) at this vertex.
   * 
   * This defines the direction between `position` and the definition point 
   * of actual visible line element (which described in `elements`).
   * 
   * Typically it's normalized from AutoCAD but it's not guaranteed in spec.
   * 
   * Parsed by group code `13`
   * */
  miterDirection: Point3D
  /**
   * @see MLineElement 
   * */
  elements?: MLineElement[]
}

export interface MLineElement {
  /**
   * Number of parameters for this segment. Typical value is `2` 
   * but it can be more than `2` if this segment is dashed one.
   *
   * Parsed by group code `74`
   */
  parameterCount: number
  /**
   * First parameter defines the distance between `position` 
   * and the start position of actual line element along `miterDirection`.
   *
   * The remains describe dash pattern of this element.
   * 
   * The second one of this is the distance from the start of the line element
   * to the first break in the line element, along `direction`.
   * 
   * The successive group code 41 values continue to list the 
   * start and stop points of the line element in this segment. 
   * 
   * Typical value is `[distance, 0]` which means a solid line.
   * 
   * Parsed by group code `41`
   * 
   * @note Linetypes do not affect to this
   */
  parameters?: number[]
  /**
   * Typical value is `0`.
   * 
   * Parsed by group code `75`
   */
  fillCount: number
  /**
   * The group code 42 parameterization is also a list of real values. 
   * Similar to the `parameters`, it describes the parameterization of
   * the fill area for this MLINE segment. 
   * 
   * The values are interpreted identically to the 41 parameters and 
   * when taken as a whole for all line elements in the MLINE segment, 
   * they define the boundary of the fill area for the MLINE segment.
   * 
   * Parsed by group code `42`
   */
  fillParameters?: number[]
}