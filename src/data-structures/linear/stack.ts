export class Stack<T> implements Iterable<T> {
  private readonly items: T[] = [];

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  push(value: T): this {
    this.items.push(value);
    return this;
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    for (let i = this.items.length - 1; i >= 0; i--) yield this.items[i]!;
  }
}
