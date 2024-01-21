export * from './flooding';

import { Vector2, Vector3 } from 'three';
import type { Point2D, Point3D } from '../types';

export function pointToVector2(point: Point3D | Point2D): Vector2 {
    return new Vector2(point.x, point.y);
}

export function pointToVector3(point: Point3D | Point2D): Vector3 {
    return new Vector3(point.x, point.y, (point as Point3D).z ?? 0);
}

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