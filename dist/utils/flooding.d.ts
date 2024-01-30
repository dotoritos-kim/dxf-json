interface FloodingParams<T> {
    seeds: T[];
    spanner(seed: T): T[];
    serializer(seed: T): number | string;
    iterationLimit?: number;
}
export declare function flooding<T>({ seeds, spanner, serializer, iterationLimit, }: FloodingParams<T>): T[][];
export {};
