/**
 * The type of symbol to use in the arc length dimension's text string.
 *
 * This can be exist in `xdata` with group code `90`. Not sure if it can exist directly in the entity.
 *
 * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-ManagedRefGuide-Autodesk_AutoCAD_DatabaseServices_ArcDimension_ArcSymbolType
 */
export enum ArcSymbolType {
  BeforeText = 0,
  AboveText = 1,
  None = 2,
}
