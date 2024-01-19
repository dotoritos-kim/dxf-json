export class Queue<T> implements Iterable<T> {
    private data: T[] = new Array(4);
    private head: number = 0;
    private tail: number = 0;
    private _size: number = 0;

    constructor(public readonly growthRate: number = 2) {}

    private grow(): void {
        const length = this.data.length;
        this.data = this.data
            .slice(this.head, length)
            .concat(this.data.slice(0, this.head))
            .concat(
                new Array(Math.max(1, Math.floor(length * this.growthRate))),
            );
        this.head = 0;
        this.tail = length;
    }

    public push(el: T): T {
        this.data[this.tail] = el;
        this.tail = (this.tail + 1) % this.data.length;
        if (this.tail === this.head) {
            this.grow();
        }
        this._size += 1;
        return el;
    }

    public pop(): T | undefined {
        if (this._size <= 0) return undefined;
        const result = this.data[this.head];
        this.head = (this.head + 1) % this.data.length;
        this._size -= 1;
        return result;
    }

    public front(): T | undefined {
        if (this._size <= 0) return undefined;
        return this.data[this.head];
    }

    public size(): number {
        return this._size;
    }

    public [Symbol.iterator](): IterableIterator<T> {
        const data = [...this.data];
        const tail = this.tail;
        let currentIndex = this.head;

        return {
            next(): IteratorResult<T> {
                if (currentIndex === tail)
                    return { value: undefined, done: true };
                const oldIndex = currentIndex;
                currentIndex = (currentIndex + 1) % data.length;
                return {
                    value: data[oldIndex],
                    done: false,
                };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }

    public isNotEmpty(): this is NonEmptyQueue<T> {
        return this._size > 0;
    }
}

interface NonEmptyQueue<T> extends Queue<T> {
    pop(): T;
}
