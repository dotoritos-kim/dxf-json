export function createMaxLessOrEqualFinder<T>(comp: (a: T, b: T) => number) {
    return (list: T[], target: T) => {
        let l = 0;
        let r = list.length - 1;

        while (l < r) {
            const m = Math.ceil((l + r) / 2);

            if (comp(list[m], target) > 0) {
                r = m - 1;
            } else {
                l = m;
            }
        }

        if (comp(list[r], target) > 0) return -1;

        return r;
    };
}
