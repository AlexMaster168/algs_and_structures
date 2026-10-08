export class Queue<T> implements Iterable<T> {
  private items: T[] = [];
  private head = 0;

  get size(): number {
    return this.items.length - this.head;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  enqueue(value: T): this {
    this.items.push(value);
    return this;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const value = this.items[this.head++];

    if (this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return value;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.head];
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    for (let i = this.head; i < this.items.length; i++) yield this.items[i]!;
  }
}
