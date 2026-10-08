export class Deque<T> implements Iterable<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private length = 0;

  constructor(initialCapacity = 8) {
    this.buffer = new Array(Math.max(1, initialCapacity));
  }

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  pushBack(value: T): this {
    this.ensureCapacity();
    this.buffer[(this.head + this.length) % this.buffer.length] = value;
    this.length++;
    return this;
  }

  pushFront(value: T): this {
    this.ensureCapacity();
    this.head = (this.head - 1 + this.buffer.length) % this.buffer.length;
    this.buffer[this.head] = value;
    this.length++;
    return this;
  }

  popBack(): T | undefined {
    if (this.length === 0) return undefined;
    const index = (this.head + this.length - 1) % this.buffer.length;
    const value = this.buffer[index];
    this.buffer[index] = undefined;
    this.length--;
    return value;
  }

  popFront(): T | undefined {
    if (this.length === 0) return undefined;
    const value = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.buffer.length;
    this.length--;
    return value;
  }

  peekFront(): T | undefined {
    return this.length === 0 ? undefined : this.buffer[this.head];
  }

  peekBack(): T | undefined {
    return this.length === 0 ? undefined : this.buffer[(this.head + this.length - 1) % this.buffer.length];
  }

  at(index: number): T | undefined {
    if (index < 0) index += this.length;
    if (index < 0 || index >= this.length) return undefined;
    return this.buffer[(this.head + index) % this.buffer.length];
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    for (let i = 0; i < this.length; i++) yield this.buffer[(this.head + i) % this.buffer.length] as T;
  }

  private ensureCapacity(): void {
    if (this.length < this.buffer.length) return;
    const next: (T | undefined)[] = new Array(this.buffer.length * 2);
    for (let i = 0; i < this.length; i++) next[i] = this.buffer[(this.head + i) % this.buffer.length];
    this.buffer = next;
    this.head = 0;
  }
}
