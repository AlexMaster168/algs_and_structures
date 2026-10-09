export class CircularBuffer {
    capacity;
    buffer;
    start = 0;
    length = 0;
    constructor(capacity) {
        this.capacity = capacity;
        if (!Number.isInteger(capacity) || capacity <= 0)
            throw new RangeError('Capacity must be a positive integer');
        this.buffer = new Array(capacity);
    }
    get size() {
        return this.length;
    }
    isFull() {
        return this.length === this.capacity;
    }
    isEmpty() {
        return this.length === 0;
    }
    push(value) {
        if (this.isFull()) {
            const overwritten = this.buffer[this.start];
            this.buffer[this.start] = value;
            this.start = (this.start + 1) % this.capacity;
            return overwritten;
        }
        this.buffer[(this.start + this.length) % this.capacity] = value;
        this.length++;
        return undefined;
    }
    shift() {
        if (this.isEmpty())
            return undefined;
        const value = this.buffer[this.start];
        this.buffer[this.start] = undefined;
        this.start = (this.start + 1) % this.capacity;
        this.length--;
        return value;
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++)
            yield this.buffer[(this.start + i) % this.capacity];
    }
}
