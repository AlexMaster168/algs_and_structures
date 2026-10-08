export class DoublyLinkedListNode<T> {
  prev: DoublyLinkedListNode<T> | null = null;
  next: DoublyLinkedListNode<T> | null = null;

  constructor(public value: T) {}
}

export class DoublyLinkedList<T> implements Iterable<T> {
  private head: DoublyLinkedListNode<T> | null = null;
  private tail: DoublyLinkedListNode<T> | null = null;
  private length = 0;

  static from<T>(values: Iterable<T>): DoublyLinkedList<T> {
    const list = new DoublyLinkedList<T>();
    for (const value of values) list.pushBack(value);
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

  pushBack(value: T): DoublyLinkedListNode<T> {
    const node = new DoublyLinkedListNode(value);
    node.prev = this.tail;
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.length++;
    return node;
  }

  pushFront(value: T): DoublyLinkedListNode<T> {
    const node = new DoublyLinkedListNode(value);
    node.next = this.head;
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
    this.length++;
    return node;
  }

  popBack(): T | undefined {
    if (!this.tail) return undefined;
    const node = this.tail;
    this.unlink(node);
    return node.value;
  }

  popFront(): T | undefined {
    if (!this.head) return undefined;
    const node = this.head;
    this.unlink(node);
    return node.value;
  }

  remove(value: T): boolean {
    for (let node = this.head; node; node = node.next) {
      if (node.value === value) {
        this.unlink(node);
        return true;
      }
    }
    return false;
  }

  unlink(node: DoublyLinkedListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;

    node.prev = null;
    node.next = null;
    this.length--;
  }

  toArray(): T[] {
    return [...this];
  }

  *reversed(): Generator<T> {
    for (let node = this.tail; node; node = node.prev) yield node.value;
  }

  *[Symbol.iterator](): Generator<T> {
    for (let node = this.head; node; node = node.next) yield node.value;
  }
}
