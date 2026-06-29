import type { CommonDxfTableEntry } from '../types.ts'

export interface BlockRecordTableEntry extends CommonDxfTableEntry {
  /**
   * Parsed by group code `100`
   */
  subclassMarker: 'AcDbBlockTableRecord'
  /**
   * Block name
   *
   * Parsed by group code `2`
   */
  name: string
  /**
   * Hard-pointer ID/handle to associated LAYOUT object
   *
   * Parsed by group code `340`
   */
  layoutObjects: string
  /**
   * Parsed by group code `70`
   */
  insertionUnits: number
  /**
   * Parsed by group code `280`
   */
  explodability: number
  /**
   * Parsed by group code `281`
   */
  scalability: number
  /**
   * Binary data for bitmap preview (optional)
   *
   * Parsed by group code `310`
   */
  bmpPreview?: string
}
