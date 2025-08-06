import type { Point2D, Point3D } from '../../types';
import type { DxfArrayScanner } from '../DxfArrayScanner';

/**
 * Parses the 2D or 3D coordinate, vector, or point. When complete,
 * the scanner remains on the last group of the coordinate.
 */
export function parsePoint(scanner: DxfArrayScanner): Point3D | Point2D {
    const point = {} as Point3D;

    // Reread group for the first coordinate
    scanner.rewind();
    let curr = scanner.next();
    const firstCode = curr.code;
    point.x = curr.value as number;

    curr = scanner.next();
    if (curr.code !== firstCode + 10)
        throw new Error(
            'Expected code for point value to be ' +
            20 +
            ' but got ' +
            curr.code +
            '.',
        );
    point.y = curr.value as number;

    curr = scanner.next();
    if (curr.code !== firstCode + 20) {
        // Only the x and y are specified. Don't read z.
        scanner.rewind(); // Let the calling code advance off the point
        return point;
    }
    point.z = curr.value as number;

    return point;
}
