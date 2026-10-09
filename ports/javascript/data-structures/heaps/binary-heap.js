import { defaultCompare } from '../../shared/compare.js';
export class BinaryHeap {
    compare;
    items;
    constructor(compare = defaultCompare, values = []) {
        this.compare = compare;
        this.items = [...values];
        for (let i = (this.items.length >> 1) - 1; i >= 0; i--)
            this.siftDown(i);
    }
    get size() {
        return this.items.length;
    }
    isEmpty() {
        return this.items.length === 0;
    }
    peek() {
        return this.items[0];
    }
    push(...values) {
        for (const value of values) {
            this.items.push(value);
            this.siftUp(this.items.length - 1);
        }
        return this;
    }
    pop() {
        if (this.items.length === 0)
            return undefined;
        const top = this.items[0];
        const last = this.items.pop();
        if (this.items.length > 0) {
            this.items[0] = last;
            this.siftDown(0);
        }
        return top;
    }
    pushPop(value) {
        if (this.items.length === 0 || this.compare(value, this.items[0]) <= 0)
            return value;
        const top = this.items[0];
        this.items[0] = value;
        this.siftDown(0);
        return top;
    }
    toSortedArray() {
        const copy = new BinaryHeap(this.compare, this.items);
        const result = [];
        while (!copy.isEmpty())
            result.push(copy.pop());
        return result;
    }
    *[Symbol.iterator]() {
        yield* this.items;
    }
    siftUp(index) {
        const { items, compare } = this;
        while (index > 0) {
            const parent = (index - 1) >> 1;
            if (compare(items[index], items[parent]) >= 0)
                break;
            [items[index], items[parent]] = [items[parent], items[index]];
            index = parent;
        }
    }
    siftDown(index) {
        const { items, compare } = this;
        const n = items.length;
        while (true) {
            const left = 2 * index + 1;
            const right = left + 1;
            let best = index;
            if (left < n && compare(items[left], items[best]) < 0)
                best = left;
            if (right < n && compare(items[right], items[best]) < 0)
                best = right;
            if (best === index)
                return;
            [items[index], items[best]] = [items[best], items[index]];
            index = best;
        }
    }
}
export class MinHeap extends BinaryHeap {
    constructor(values = []) {
        super(defaultCompare, values);
    }
}
export class MaxHeap extends BinaryHeap {
    constructor(values = []) {
        super((a, b) => defaultCompare(b, a), values);
    }
}
