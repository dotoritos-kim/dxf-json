export function createDisjointSet(initialSize: number) {
    const roots = Array.from(new Array(initialSize), (_, index) => index);
    const sizes = roots.map(() => 1);
    let groups = initialSize;

    // return the id of the set which given index-th element exists.
    // but set id may changes if further union operations are done.
    function find(index: number): number {
        if (roots[index] === index) return index;
        return (roots[index] = find(roots[index]));
    }

    function union(ia: number, ib: number): void {
        let ra = find(ia);
        let rb = find(ib);

        if (ra === rb) return;

        if (sizes[ra] < sizes[rb]) {
            [ra, rb] = [rb, ra];
        }

        roots[rb] = ra;
        sizes[ra] += sizes[rb];
        groups -= 1;
    }

    // return the size of the set which has index-th element.
    // if index is not given, return the number of dijoint sets.
    function size(index?: number): number {
        if (index === undefined) return groups;
        return sizes[find(index)];
    }

    function getSets() {
        const map: Record<number, number[]> = {};
        for (let i = 0; i < roots.length; ++i) {
            const rootIndex = find(i);

            map[rootIndex] ??= [];
            map[rootIndex].push(i);
        }
        return map;
    }

    return {
        find,
        union,
        size,
        getSets,
    };
}
