import { DoublyLinkedList, type DoublyLinkedListNode } from '../linear/doubly-linked-list.js';

export class LRUCache<K, V> {
  private readonly nodes = new Map<K, DoublyLinkedListNode<[K, V]>>();
  private readonly order = new DoublyLinkedList<[K, V]>();

  constructor(readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) throw new RangeError('Capacity must be a positive integer');
  }

  get size(): number {
    return this.nodes.size;
  }

  get(key: K): V | undefined {
    const node = this.nodes.get(key);
    if (!node) return undefined;
    this.touch(key, node.value[1], node);
    return node.value[1];
  }

  has(key: K): boolean {
    return this.nodes.has(key);
  }

  set(key: K, value: V): this {
    const existing = this.nodes.get(key);
    this.touch(key, value, existing);

    if (this.nodes.size > this.capacity) {
      const [oldestKey] = this.order.popBack()!;
      this.nodes.delete(oldestKey);
    }

    return this;
  }

  delete(key: K): boolean {
    const node = this.nodes.get(key);
    if (!node) return false;
    this.order.unlink(node);
    return this.nodes.delete(key);
  }

  keys(): K[] {
    return this.order.toArray().map(([key]) => key);
  }

  private touch(key: K, value: V, node?: DoublyLinkedListNode<[K, V]>): void {
    if (node) this.order.unlink(node);
    this.nodes.set(key, this.order.pushFront([key, value]));
  }
}
