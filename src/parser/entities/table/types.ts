import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

/** Value stored in a `CELL_VALUE` block (301 ... 304 ACVALUE_END) */
export interface TableCellValue {
  /** Group code 93 */
  flags?: number
  /**
   * Group code 90.
   * 0: unknown, 1: long, 2: double, 4: string, 8: date, 16: point2d,
   * 32: point3d, 64: object id, 128: buffer, 256: result buffer, 512: general
   */
  dataType?: number
  /** Group code 1 (with preceding group code 2 chunks) */
  string?: string
  /** Group code 140 */
  double?: number
  /** Group code 91 */
  long?: number
  /** Group code 11/21/31 */
  point?: Point3D
  /** Group code 94 */
  unitType?: number
  /** Group code 300 */
  formatString?: string
  /** Group code 302 */
  formattedValue?: string
}

export interface TableCell {
  /** Group code 171. 1: text, 2: block */
  cellType: number
  /** Group code 172 */
  flag?: number
  /** Group code 173 */
  mergedValue?: number
  /** Group code 174 */
  autoFit?: number
  /** Group code 175: number of columns spanned (merged) */
  borderWidth?: number
  /** Group code 176: number of rows spanned (merged) */
  borderHeight?: number
  /** Group code 91 */
  overrideFlag?: number
  /** Group code 178 */
  virtualEdgeFlag?: number
  /** Group code 145 */
  rotation?: number
  /** Group code 344 */
  fieldObjectId?: string
  /** Group code 1 (with preceding group code 2 chunks), legacy cell text */
  text?: string
  /** Group code 7 */
  textStyle?: string
  /** Group code 140 */
  textHeight?: number
  /** Group code 170 */
  alignment?: number
  /** Group code 64 */
  textColor?: number
  /** Group code 63 */
  backgroundColor?: number
  /** Group code 283 */
  isBackgroundFilled?: boolean
  /** Group code 69 */
  topBorderColor?: number
  /** Group code 65 */
  rightBorderColor?: number
  /** Group code 66 */
  bottomBorderColor?: number
  /** Group code 68 */
  leftBorderColor?: number
  /** Group code 279 */
  topBorderLineweight?: number
  /** Group code 275 */
  rightBorderLineweight?: number
  /** Group code 276 */
  bottomBorderLineweight?: number
  /** Group code 278 */
  leftBorderLineweight?: number
  /** Group code 289 */
  topBorderVisibility?: boolean
  /** Group code 285 */
  rightBorderVisibility?: boolean
  /** Group code 286 */
  bottomBorderVisibility?: boolean
  /** Group code 288 */
  leftBorderVisibility?: boolean
  /** Group code 92 */
  extendedFlags?: number
  /** Group code 340 */
  blockTableRecordHandle?: string
  /** Group code 144 */
  blockScale?: number
  /** Group code 179 */
  attrDefCount?: number
  /** Group code 331 */
  attrDefHandles?: string[]
  /** Group code 300 (outside CELL_VALUE) */
  attrDefTexts?: string[]
  /** CELL_VALUE block (301 ... 304) */
  value?: TableCellValue
}

export interface TableEntity extends CommonDxfEntity {
  type: 'ACAD_TABLE'
  subclassMarker: 'AcDbTable'
  /** Group code 2: anonymous block name (e.g. `*T1`) */
  name: string
  /** Group code 10/20/30: insertion point */
  startPoint: Point3D
  /** Group code 280 */
  version?: number
  /** Group code 342 */
  tableStyleId?: string
  /** Group code 343 */
  blockRecordHandle?: string
  /** Group code 11/21/31 */
  directionVector?: Point3D
  /** Group code 90 */
  tableValue?: number
  /** Group code 91 */
  rowCount: number
  /** Group code 92 */
  columnCount: number
  /** Group code 93 */
  overrideFlag?: number
  /** Group code 94 */
  borderColorOverrideFlag?: number
  /** Group code 95 */
  borderLineweightOverrideFlag?: number
  /** Group code 96 */
  borderVisibilityOverrideFlag?: number
  /** Group code 141 */
  rowHeights: number[]
  /** Group code 142 */
  columnWidths: number[]
  /** Group code 210 */
  extrusionDirection?: Point3D
  /** Cells in row-major order (rowCount * columnCount) */
  cells: TableCell[]
}
