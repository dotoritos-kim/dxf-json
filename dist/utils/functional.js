"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupPairs = exports.findLast = exports.separate = exports.reverseIterator = exports.subIterator = exports.argmin = exports.adjacentPairs = void 0;
function* adjacentPairs(itr, n, isClosed) {
    const first = new Array(n - 1);
    const buffer = new Array(n);
    let count = 0;
    for (const value of itr) {
        pull(buffer, value);
        if (++count >= n) {
            yield [...buffer];
        }
        else if (count < n) {
            first[count - 1] = value;
        }
    }
    if (count >= n && isClosed) {
        for (const value of first) {
            pull(buffer, value);
            yield [...buffer];
        }
    }
}
exports.adjacentPairs = adjacentPairs;
function pull(values, newValue) {
    for (let i = 0; i < values.length - 1; ++i) {
        values[i] = values[i + 1];
    }
    values[values.length - 1] = newValue;
}
function argmin(itr, evaluator) {
    let score = Infinity;
    let target = null;
    let index = -1;
    let count = 0;
    for (const value of itr) {
        const newScore = evaluator(value);
        if (score > newScore) {
            score = newScore;
            target = value;
            index = count;
        }
        ++count;
    }
    return { target, score, index };
}
exports.argmin = argmin;
function* subIterator(array, start, end) {
    for (let i = start; i <= end; ++i) {
        yield array[i];
    }
}
exports.subIterator = subIterator;
function* reverseIterator(array) {
    for (let i = array.length - 1; i >= 0; --i) {
        yield array[i];
    }
}
exports.reverseIterator = reverseIterator;
function separate(predicate, itr) {
    const truthy = [];
    const falsy = [];
    for (const value of itr) {
        if (predicate(value)) {
            truthy.push(value);
        }
        else {
            falsy.push(value);
        }
    }
    return [truthy, falsy];
}
exports.separate = separate;
function findLast(predicate, isIncremental, // true일 경우, predicate가 실패하는 즉시 종료
itr) {
    let lastSatisfyingIndex = -1;
    let lastSatisfying = undefined;
    let index = 0;
    for (const value of itr) {
        if (predicate(value)) {
            lastSatisfyingIndex = index;
            lastSatisfying = value;
        }
        else if (isIncremental) {
            break;
        }
        index += 1;
    }
    return [lastSatisfying, lastSatisfyingIndex];
}
exports.findLast = findLast;
/**
 * size개씩 자른 것을 생성한다. 만약 마지막에 size개가 안되면 그냥 되는대로 준다.
 * @param size
 * @param iterable
 */
function* groupPairs(size, iterable) {
    let pairs = [];
    for (const value of iterable) {
        pairs.push(value);
        if (pairs.length >= size) {
            yield pairs;
            pairs = [];
        }
    }
    if (pairs.length) {
        yield pairs;
    }
}
exports.groupPairs = groupPairs;
//# sourceMappingURL=functional.js.map