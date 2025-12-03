import type { Point3D } from '../../../types/shared.ts'

/**
 * https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-A2A628B0-3699-4740-A215-C560E7242F63
 *
 * Represent extended data (xdata). The structure varies to their applications.
 *
 * If 1002 code occurs, nested array will be created
 * */

export interface XData {
  /** Application names can be up to 31 bytes long */
  appName: string
  /** Primitive value or recursive array of them */
  value: XDataEntry[]
}

export type XDataEntry = number | string | Point3D | XDataEntry[]
