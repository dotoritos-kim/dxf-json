import { BoundaryPathTypeFlag } from '../../../../consts/hatch.ts'
import type { DxfArrayScanner, ScannerGroup } from '../../../DxfArrayScanner.ts'
import { createParser } from '../../../shared/parserGenerator.ts'
import { EdgeBoundaryPathDataSnippets } from './edge.ts'
import { PolylineSnippets } from './polyline.ts'

export function parseBoundaryPathData(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
) {
  // assume start with 92
  const boundaryPathData = {
    boundaryPathTypeFlag: curr.value,
  }
  const isPolyline =
    boundaryPathData.boundaryPathTypeFlag & BoundaryPathTypeFlag.Polyline

  curr = scanner.next()

  if (isPolyline) {
    createParser(PolylineSnippets)(curr, scanner, boundaryPathData)
    return boundaryPathData
  }
  createParser(EdgeBoundaryPathDataSnippets)(curr, scanner, boundaryPathData)
  return boundaryPathData
}
