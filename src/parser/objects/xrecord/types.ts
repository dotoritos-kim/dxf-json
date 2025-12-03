import type { ScannerGroup } from '../../DxfArrayScanner.ts'
import type { CommonDXFObject } from '../types.ts'
import type { RecordCloneFlag } from '../consts.ts'

export interface XRecordDXFObject extends CommonDXFObject {
  subclassMarker: 'AcDbXrecord'
  /**
   * When object is cloned like block insert, xrecord is also copied.
   * Therefore the name of xrecords may have duplicated names.
   * This flag determines how AutoCAD handles name collision.
   *
   * @see RecordCloneFlag
   * */
  cloneFlag: RecordCloneFlag
  data: ScannerGroup[]
}
