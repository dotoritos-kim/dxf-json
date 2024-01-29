import type { Point2D, Point3D } from '../../types';
import type DxfArrayScanner from '../DxfArrayScanner';
/**
 * Parses the 2D or 3D coordinate, vector, or point. When complete,
 * the scanner remains on the last group of the coordinate.
 */
export declare function parsePoint(scanner: DxfArrayScanner): Point3D | Point2D;
