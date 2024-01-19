export * from './binarySearch';
export * from './disjointSet';
export * from './graph';
export * from './functional';
export * from './flooding';
export * from './triangle';
export * from './queue';

import { reduce } from '@fxts/core';
import { Vector2, Vector3 } from 'three';
import type { Bound, Point2D, Point3D } from '../types';

export function pointToVector2(point: Point3D | Point2D): Vector2 {
    return new Vector2(point.x, point.y);
}

export function pointToVector3(point: Point3D | Point2D): Vector3 {
    return new Vector3(point.x, point.y, (point as Point3D).z ?? 0);
}

export function swapVector(v1: Vector2, v2: Vector2): void {
    let temp = v1.x;
    v1.x = v2.x;
    v2.x = temp;
    temp = v1.y;
    v1.y = v2.y;
    v2.y = temp;
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

export function updateBounds(v: Point2D, bounds?: Bound) {
    bounds ??= { minX: v.x, maxX: v.x, minY: v.y, maxY: v.y };
    bounds.minX = Math.min(bounds.minX, v.x);
    bounds.maxX = Math.max(bounds.maxX, v.x);
    bounds.minY = Math.min(bounds.minY, v.y);
    bounds.maxY = Math.max(bounds.maxY, v.y);
    return bounds;
}

export function getBoundBox(vertices: Iterable<Point2D>) {
    return reduce(
        (bound, v) => updateBounds(v, bound),
        {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
        },
        vertices,
    );
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

export function swap<T>(list: T[], i1: number, i2: number) {
    const temp = list[i1];
    list[i1] = list[i2];
    list[i2] = temp;
}

export function pushIfNotEqual(v: Vector2, vertices: Vector2[]) {
    if (!vertices.length) {
        vertices.push(v);
        return;
    }

    const u = vertices.at(-1)!;

    if (v.x !== u.x || v.y !== u.y) {
        vertices.push(v);
    }
}
