export class LinkedListNode<T> {
  next: LinkedListNode<T> | null = null;

  constructor(public value: T) {}
}

export class LinkedList<T> implements Iterable<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private length = 0;

  static from<T>(values: Iterable<T>): LinkedList<T> {
    const list = new LinkedList<T>();
    for (const value of values) list.append(value);
    return list;
  }

  get size(): number {
    return this.length;
  }

  get first(): T | undefined {
    return this.head?.value;
  }

  get last(): T | undefined {
    return this.tail?.value;
  }

  append(value: T): this {
    const node = new LinkedListNode(value);
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.length++;
    return this;
  }

  prepend(value: T): this {
    const node = new LinkedListNode(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.length++;
    return this;
  }

  insertAt(index: number, value: T): this {
    if (index < 0 || index > this.length) throw new RangeError(`Index ${index} is out of bounds`);
    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);

    const previous = this.nodeAt(index - 1);
    const node = new LinkedListNode(value);
    node.next = previous.next;
    previous.next = node;
    this.length++;
    return this;
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;
    return this.nodeAt(index).value;
  }

  indexOf(value: T): number {
    let index = 0;
    for (let node = this.head; node; node = node.next, index++) {
      if (node.value === value) return index;
    }
    return -1;
  }

  find(predicate: (value: T) => boolean): T | undefined {
    for (const value of this) if (predicate(value)) return value;
    return undefined;
  }

  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;

    let removed: LinkedListNode<T>;
    if (index === 0) {
      removed = this.head!;
      this.head = removed.next;
      if (!this.head) this.tail = null;
    } else {
      const previous = this.nodeAt(index - 1);
      removed = previous.next!;
      previous.next = removed.next;
      if (removed === this.tail) this.tail = previous;
    }

    this.length--;
    return removed.value;
  }

  remove(value: T): boolean {
    const index = this.indexOf(value);
    if (index === -1) return false;
    this.removeAt(index);
    return true;
  }

  reverse(): this {
    let previous: LinkedListNode<T> | null = null;
    let current = this.head;
    this.tail = current;

    while (current) {
      const next: LinkedListNode<T> | null = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }

    this.head = previous;
    return this;
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    for (let node = this.head; node; node = node.next) yield node.value;
  }

  private nodeAt(index: number): LinkedListNode<T> {
    let node = this.head!;
    for (let i = 0; i < index; i++) node = node.next!;
    return node;
  }
}
