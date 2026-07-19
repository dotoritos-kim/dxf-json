/** OLE object type (group 71) */
export enum OleObjectType {
  Link = 1,
  Embedded = 2,
  Static = 3,
}

/**
 * Tile mode descriptor (group 72)
 * @note Distinct from common entity group 67 (paper space flag).
 */
export enum OleTileMode {
  ModelSpace = 0,
  PaperSpace = 1,
}
