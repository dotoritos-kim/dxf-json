export declare function createDisjointSet(initialSize: number): {
    find: (index: number) => number;
    union: (ia: number, ib: number) => void;
    size: (index?: number) => number;
    getSets: () => Record<number, number[]>;
};
