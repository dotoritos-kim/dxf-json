"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flooding = void 0;
function flooding({ seeds, spanner, serializer, iterationLimit = Infinity, }) {
    const memo = new Set();
    let iterations = 0;
    return seeds
        .map((seed) => {
        const group = [];
        const stack = [[seed, serializer(seed)]];
        while (stack.length && iterations++ < iterationLimit) {
            const [current, key] = stack.pop();
            if (memo.has(key))
                continue;
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
exports.flooding = flooding;
//# sourceMappingURL=flooding.js.map