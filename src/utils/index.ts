export * from './flooding';

import type { Point2D, Point3D } from '@src/types'

export function classify<T>(
    iterable: Iterable<T>,
    keySelector: (value: T) => string | undefined,
) {
    const result: Record<string, T[]> = {};
    for (const value of iterable) {
        const key = keySelector(value);

        if (key != null) {
            result[key] ??= [];
            result[key].push(value);
        }
    }
    return result;
}

/**
 * 정수 생성기
 *
 * @param start Inclusive
 * @param end Exclusive
 * @param increment Default = 1
 */
export function* generateIntegers(
    start: number,
    end: number = Infinity,
    increment: number = 1,
) {
    for (let n = start; n !== end; n += increment) {
        yield n;
    }
}

/**
 * There might be some situation of ill conditioned points.
 * This function ensure every values exists for possible
 * missing data.
 * @param point Any data parsed by `parsePoint`
 */
export function ensurePoint3D(point: Partial<Point2D | Point3D>): Point3D {
    return {
        x: point.x ?? 0,
        y: point.y ?? 0,
        z: (point as Point3D).z ?? 0,
    }
}