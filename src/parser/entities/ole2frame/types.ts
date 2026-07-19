import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'
import type { OleObjectType, OleTileMode } from './consts.ts'

/**
 * @see https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-77747CE6-82C6-4452-97ED-4CEEB38BE960
 *
 * Values such as corners and OLE type are treated as read-only by AutoCAD on
 * OPEN; the authoritative geometry lives inside the OLE binary object.
 */
export interface Ole2FrameEntity extends CommonDxfEntity {
  type: 'OLE2FRAME'
  subclassMarker: 'AcDbOle2Frame'
  /** OLE version number */
  version: number
  /**
   * OLE object name / description (group 3).
   * Autodesk samples use strings like `"Paintbrush Picture"`.
   */
  name: string
  /** Upper-left corner (WCS) */
  upperLeftCorner: Point3D
  /** Lower-right corner (WCS) */
  lowerRightCorner: Point3D
  /** OLE object type */
  oleObjectType: OleObjectType
  /** Tile mode descriptor */
  tileMode: OleTileMode
  /**
   * Output quality (group 73). Present in many real DXF files though not
   * listed in the Autodesk DXF reference table.
   */
  quality?: number
  /** Length of binary data in bytes */
  dataSize: number
  /** Binary OLE data as hex string */
  data: string
}
