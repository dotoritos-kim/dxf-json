import type { Point2D, Point3D } from '../../types/shared.ts'
import type { DxfArrayScanner } from '../DxfArrayScanner.ts'

/**
 * Parses the 2D or 3D coordinate, vector, or point. When complete,
 * the scanner remains on the last group of the coordinate.
 */
export function parsePoint(scanner: DxfArrayScanner): Point3D | Point2D {
  const point = {} as Point3D

  // Reread group for the first coordinate
  scanner.rewind()
  let curr = scanner.next()
  const firstCode = curr.code
  point.x = curr.value as number

  curr = scanner.next()
  if (curr.code !== firstCode + 10) {
    // y 좌표 그룹이 없는 비정상 입력: 예외 대신 y=0 으로 보고
    // 읽은 그룹은 호출자가 다시 처리하도록 되돌린다.
    point.y = 0
    scanner.rewind()
    return point
  }
  point.y = curr.value as number

  curr = scanner.next()
  if (curr.code !== firstCode + 20) {
    // Only the x and y are specified. Don't read z.
    scanner.rewind() // Let the calling code advance off the point
    return point
  }
  point.z = curr.value as number

  return point
}
