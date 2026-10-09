export class Deque {
    buffer;
    head = 0;
    length = 0;
    constructor(initialCapacity = 8) {
        this.buffer = new Array(Math.max(1, initialCapacity));
    }
    get size() {
        return this.length;
    }
    isEmpty() {
        return this.length === 0;
    }
    pushBack(value) {
        this.ensureCapacity();
        this.buffer[(this.head + this.length) % this.buffer.length] = value;
        this.length++;
        return this;
    }
    pushFront(value) {
        this.ensureCapacity();
        this.head = (this.head - 1 + this.buffer.length) % this.buffer.length;
        this.buffer[this.head] = value;
        this.length++;
        return this;
    }
    popBack() {
        if (this.length === 0)
            return undefined;
        const index = (this.head + this.length - 1) % this.buffer.length;
        const value = this.buffer[index];
        this.buffer[index] = undefined;
        this.length--;
        return value;
    }
    popFront() {
        if (this.length === 0)
            return undefined;
        const value = this.buffer[this.head];
        this.buffer[this.head] = undefined;
        this.head = (this.head + 1) % this.buffer.length;
        this.length--;
        return value;
    }
    peekFront() {
        return this.length === 0 ? undefined : this.buffer[this.head];
    }
    peekBack() {
        return this.length === 0 ? undefined : this.buffer[(this.head + this.length - 1) % this.buffer.length];
    }
    at(index) {
        if (index < 0)
            index += this.length;
        if (index < 0 || index >= this.length)
            return undefined;
        return this.buffer[(this.head + index) % this.buffer.length];
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++)
            yield this.buffer[(this.head + i) % this.buffer.length];
    }
    ensureCapacity() {
        if (this.length < this.buffer.length)
            return;
        const next = new Array(this.buffer.length * 2);
        for (let i = 0; i < this.length; i++)
            next[i] = this.buffer[(this.head + i) % this.buffer.length];
        this.buffer = next;
        this.head = 0;
    }
}
