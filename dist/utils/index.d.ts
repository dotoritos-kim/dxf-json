export * from './flooding';
import type { Point2D, Point3D } from 'types';
export declare function classify<T>(iterable: Iterable<T>, keySelector: (value: T) => string | undefined): Record<string, T[]>;
/**
 * 정수 생성기
 *
 * @param start Inclusive
 * @param end Exclusive
 * @param increment Default = 1
 */
export declare function generateIntegers(start: number, end?: number, increment?: number): Generator<number, void, unknown>;
/**
 * There might be some situation of ill conditioned points.
 * This function ensure every values exists for possible
 * missing data.
 * @param point Any data parsed by `parsePoint`
 */
export declare function ensurePoint3D(point: Partial<Point2D | Point3D>): Point3D;
