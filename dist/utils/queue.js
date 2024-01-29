"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor(growthRate = 2) {
        this.growthRate = growthRate;
        this.data = new Array(4);
        this.head = 0;
        this.tail = 0;
        this._size = 0;
    }
    grow() {
        const length = this.data.length;
        this.data = this.data
            .slice(this.head, length)
            .concat(this.data.slice(0, this.head))
            .concat(new Array(Math.max(1, Math.floor(length * this.growthRate))));
        this.head = 0;
        this.tail = length;
    }
    push(el) {
        this.data[this.tail] = el;
        this.tail = (this.tail + 1) % this.data.length;
        if (this.tail === this.head) {
            this.grow();
        }
        this._size += 1;
        return el;
    }
    pop() {
        if (this._size <= 0)
            return undefined;
        const result = this.data[this.head];
        this.head = (this.head + 1) % this.data.length;
        this._size -= 1;
        return result;
    }
    front() {
        if (this._size <= 0)
            return undefined;
        return this.data[this.head];
    }
    size() {
        return this._size;
    }
    [Symbol.iterator]() {
        const data = [...this.data];
        const tail = this.tail;
        let currentIndex = this.head;
        return {
            next() {
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
    isNotEmpty() {
        return this._size > 0;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map