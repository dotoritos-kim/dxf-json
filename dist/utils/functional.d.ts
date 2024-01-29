export declare function adjacentPairs<T>(itr: Iterable<T>, n: number, isClosed?: boolean): Generator<T[], void, unknown>;
export declare function argmin<T>(itr: Iterable<T>, evaluator: (value: T) => number): {
    target: T;
    score: number;
    index: number;
};
export declare function subIterator<T>(array: T[], start: number, end: number): Generator<T, void, unknown>;
export declare function reverseIterator<T>(array: T[]): Generator<T, void, unknown>;
export declare function separate<T>(predicate: (value: T) => boolean, itr: Iterable<T>): T[][];
export declare function findLast<T>(predicate: (value: T) => boolean, isIncremental: boolean, // true일 경우, predicate가 실패하는 즉시 종료
itr: Iterable<T>): [T | undefined, number];
/**
 * size개씩 자른 것을 생성한다. 만약 마지막에 size개가 안되면 그냥 되는대로 준다.
 * @param size
 * @param iterable
 */
export declare function groupPairs<T>(size: number, iterable: Iterable<T>): Generator<T[], void, unknown>;
