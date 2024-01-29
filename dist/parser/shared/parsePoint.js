"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePoint = void 0;
/**
 * Parses the 2D or 3D coordinate, vector, or point. When complete,
 * the scanner remains on the last group of the coordinate.
 */
function parsePoint(scanner) {
    const point = {};
    // Reread group for the first coordinate
    scanner.rewind();
    let curr = scanner.next();
    const firstCode = curr.code;
    point.x = curr.value;
    curr = scanner.next();
    if (curr.code !== firstCode + 10)
        throw new Error('Expected code for point value to be ' +
            20 +
            ' but got ' +
            curr.code +
            '.');
    point.y = curr.value;
    curr = scanner.next();
    if (curr.code !== firstCode + 20) {
        // Only the x and y are specified. Don't read z.
        scanner.rewind(); // Let the calling code advance off the point
        return point;
    }
    point.z = curr.value;
    return point;
}
exports.parsePoint = parsePoint;
//# sourceMappingURL=parsePoint.js.map