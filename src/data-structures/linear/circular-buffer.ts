export class CircularBuffer<T> implements Iterable<T> {
  private readonly buffer: (T | undefined)[];
  private start = 0;
  private length = 0;

  constructor(readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) throw new RangeError('Capacity must be a positive integer');
    this.buffer = new Array(capacity);
  }

  get size(): number {
    return this.length;
  }

  isFull(): boolean {
    return this.length === this.capacity;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  push(value: T): T | undefined {
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

  shift(): T | undefined {
    if (this.isEmpty()) return undefined;
    const value = this.buffer[this.start];
    this.buffer[this.start] = undefined;
    this.start = (this.start + 1) % this.capacity;
    this.length--;
    return value;
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    for (let i = 0; i < this.length; i++) yield this.buffer[(this.start + i) % this.capacity] as T;
  }
}
