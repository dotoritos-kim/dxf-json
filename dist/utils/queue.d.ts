export declare class Queue<T> implements Iterable<T> {
    readonly growthRate: number;
    private data;
    private head;
    private tail;
    private _size;
    constructor(growthRate?: number);
    private grow;
    push(el: T): T;
    pop(): T | undefined;
    front(): T | undefined;
    size(): number;
    [Symbol.iterator](): IterableIterator<T>;
    isNotEmpty(): this is NonEmptyQueue<T>;
}
interface NonEmptyQueue<T> extends Queue<T> {
    pop(): T;
}
export {};
