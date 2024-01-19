interface FloodingParams<T> {
    seeds: T[];
    spanner(seed: T): T[];
    serializer(seed: T): number | string;
    iterationLimit?: number;
}

export function flooding<T>({
    seeds,
    spanner,
    serializer,
    iterationLimit = Infinity,
}: FloodingParams<T>) {
    const memo = new Set<string | number>();
    let iterations = 0;

    return seeds
        .map((seed) => {
            const group: T[] = [];
            const stack: [T, string | number][] = [[seed, serializer(seed)]];

            while (stack.length && iterations++ < iterationLimit) {
                const [current, key] = stack.pop()!;

                if (memo.has(key)) continue;
                memo.add(key);
                group.push(current);

                for (const next of spanner(current)) {
                    stack.push([next, serializer(next)]);
                }
            }

            return group;
        })
        .filter((group) => group.length);
}
