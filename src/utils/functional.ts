export function* adjacentPairs<T>(
    itr: Iterable<T>,
    n: number,
    isClosed?: boolean,
) {
    const first = new Array(n - 1) as T[];
    const buffer = new Array(n) as T[];
    let count = 0;
    for (const value of itr) {
        pull(buffer, value);

        if (++count >= n) {
            yield [...buffer];
        } else if (count < n) {
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

function pull<T>(values: T[], newValue: T) {
    for (let i = 0; i < values.length - 1; ++i) {
        values[i] = values[i + 1];
    }
    values[values.length - 1] = newValue;
}

export function argmin<T>(itr: Iterable<T>, evaluator: (value: T) => number) {
    let score = Infinity;
    let target: T = null as T;
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

export function* subIterator<T>(array: T[], start: number, end: number) {
    for (let i = start; i <= end; ++i) {
        yield array[i];
    }
}

export function* reverseIterator<T>(array: T[]) {
    for (let i = array.length - 1; i >= 0; --i) {
        yield array[i];
    }
}

export function separate<T>(
    predicate: (value: T) => boolean,
    itr: Iterable<T>,
) {
    const truthy: T[] = [];
    const falsy: T[] = [];

    for (const value of itr) {
        if (predicate(value)) {
            truthy.push(value);
        } else {
            falsy.push(value);
        }
    }

    return [truthy, falsy];
}

export function findLast<T>(
    predicate: (value: T) => boolean,
    isIncremental: boolean, // true일 경우, predicate가 실패하는 즉시 종료
    itr: Iterable<T>,
): [T | undefined, number] {
    let lastSatisfyingIndex = -1;
    let lastSatisfying: T | undefined = undefined;
    let index = 0;

    for (const value of itr) {
        if (predicate(value)) {
            lastSatisfyingIndex = index;
            lastSatisfying = value;
        } else if (isIncremental) {
            break;
        }
        index += 1;
    }

    return [lastSatisfying, lastSatisfyingIndex];
}

/**
 * size개씩 자른 것을 생성한다. 만약 마지막에 size개가 안되면 그냥 되는대로 준다.
 * @param size
 * @param iterable
 */
export function* groupPairs<T>(size: number, iterable: Iterable<T>) {
    let pairs: T[] = [];
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
