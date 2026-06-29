import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'
import type { VertexFlag } from './consts.ts'

/**
 * VERTEX ENTITY used to define vertices of POLYLINE, POLYFACE etc.
 *
 * @note
 * If the vertex defines a face of the mesh, its vertex flags group
 * has the 128 bit set but not the 64 bit. In this case, `x`, `y`, `z`
 * of the face entity are **irrelevant and are always written as 0**
 * in a DXF file.
 */
export interface VertexEntity extends CommonDxfEntity, Point3D {
  /** Parsed by group code `100` */
  subclassMarker: 'AcDb2dVertex' | 'AcDb3dPolylineVertex'
  /**
   * Parsed by group code `40`
   *
   * @default 0
   */
  startWidth: number
  /**
   * Parsed by group code `41`
   *
   * @default 0
   */
  endWidth: number
  /**
   * The `bulge` is the tangent of one fourth the included angle for an arc segment,
   * made negative if the arc goes clockwise from the start point to the endpoint.
   *
   * A bulge of 0 indicates a straight segment, and a bulge of 1 is a semicircle
   *
   * Parsed by group code `42`
   *
   * @default 0
   */
  bulge: number
  /**
   * Parsed by group code `70`
   *
   * @see VertexFlag
   */
  flag: VertexFlag
  /**
   * Curve fit tangent direction.
   * It's only significant if `flag` has `VertexFlag.TANGENT_DEFINED`.
   *
   * Parsed by group code `50`
   *
   * @default 0
   * @note Originally this group may ommited even the flag is on. But
   * the parser will explicitly set it to 0.
   */
  tangentDirection: number
  /**
   * Indices of polyface mesh vertices
   *
   * If the index is negative, the edge that begins with that vertex is invisible.
   *
   * The first `0` vertex marks the end of the vertices of the face.
   *
   * Parsed by group code `71`, `72`, `73`, `74`
   */
  faces?: number[]
  /**
   * Vertex identifier
   *
   * Parsed by group code `91`
   */
  id: number
}
