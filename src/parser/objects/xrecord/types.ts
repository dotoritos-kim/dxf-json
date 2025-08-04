import type { ScannerGroup } from "@src/parser/DxfArrayScanner";
import type { CommonDXFObject } from "../types";
import type { RecordCloneFlag } from "../consts";

export interface XRecordDXFObject extends CommonDXFObject {
  subclassMarker: "AcDbXrecord";
  /** 
   * When object is cloned like block insert, xrecord is also copied.
   * Therefore the name of xrecords may have duplicated names.
   * This flag determines how AutoCAD handles name collision.
   * 
   * @see RecordCloneFlag
   * */
  cloneFlag: RecordCloneFlag;
  data: ScannerGroup[]
}