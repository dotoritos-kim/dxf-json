export * from './binarySearch';
export * from './disjointSet';
export * from './graph';
export * from './functional';
export * from './flooding';
export * from './triangle';
export * from './queue';
import { Vector2, Vector3 } from 'three';
import type { Bound, Point2D, Point3D } from '../types';
export declare function pointToVector2(point: Point3D | Point2D): Vector2;
export declare function pointToVector3(point: Point3D | Point2D): Vector3;
export declare function swapVector(v1: Vector2, v2: Vector2): void;
export declare function classify<T>(iterable: Iterable<T>, keySelector: (value: T) => string | undefined): Record<string, T[]>;
export declare function updateBounds(v: Point2D, bounds?: Bound): Bound;
export declare function getBoundBox(vertices: Iterable<Point2D>): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};
/**
 * 정수 생성기
 *
 * @param start Inclusive
 * @param end Exclusive
 * @param increment Default = 1
 */
export declare function generateIntegers(start: number, end?: number, increment?: number): Generator<number, void, unknown>;
export declare function swap<T>(list: T[], i1: number, i2: number): void;
export declare function pushIfNotEqual(v: Vector2, vertices: Vector2[]): void;
