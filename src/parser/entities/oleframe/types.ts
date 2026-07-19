import type { CommonDxfEntity } from '../shared.ts'

/**
 * @see https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-4A10EF68-35A3-4961-8B15-1222ECE5E8C6
 */
export interface OleFrameEntity extends CommonDxfEntity {
  type: 'OLEFRAME'
  subclassMarker: 'AcDbOleFrame'
  /** OLE version number */
  version: number
  /** Length of binary data in bytes */
  dataSize: number
  /** Binary OLE data as hex string */
  data: string
}
