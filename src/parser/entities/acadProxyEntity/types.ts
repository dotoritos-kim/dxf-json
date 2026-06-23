import type { CommonDxfEntity } from '../shared.ts'
import type { AcadProxyOriginalDataFormat } from './consts.ts'

/**
 * @see https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-89A690F9-E859-4D57-89EA-750F3FB76C6B
 */
export interface AcadProxyEntity extends CommonDxfEntity {
  type: 'ACAD_PROXY_ENTITY'
  subclassMarker: 'AcDbProxyEntity'
  /** Proxy entity class ID (always 498) */
  proxyEntityClassId: number
  /** Application entity class ID from CLASSES section order (500+) */
  applicationEntityClassId: number
  /** Original DXF entity name (group 1) */
  originalDxfName?: string
  /** Size of graphics data in bytes */
  graphicsDataSize?: number
  /** Binary graphics data as hex string */
  graphicsData?: string
  /** Size of entity data in bits */
  entityDataSize?: number
  /** Binary entity data as hex string */
  entityData?: string
  /** Size of unknown binary data in bytes (R2010+: group 162) */
  unknownDataSize?: number
  /** Unknown binary data as hex string (group 311) */
  unknownData?: string
  /** Linked object IDs from the proxy entity */
  linkedObjectIds?: string[]
  /** Object drawing format when it becomes a proxy */
  objectDrawingFormat?: number
  /** Original custom object data format */
  originalDataFormat?: AcadProxyOriginalDataFormat
}
