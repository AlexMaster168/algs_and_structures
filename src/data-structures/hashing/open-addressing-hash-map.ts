import { defaultHasher } from './hash.js';

const EMPTY = Symbol('empty');
const DELETED = Symbol('deleted');

type Slot<K, V> = typeof EMPTY | typeof DELETED | { key: K; value: V };

export class OpenAddressingHashMap<K, V> implements Iterable<[K, V]> {
  private slots: Slot<K, V>[];
  private count = 0;
  private tombstones = 0;

  constructor(
    private readonly hasher: (key: K) => number = defaultHasher,
    initialCapacity = 16,
  ) {
    this.slots = new Array(Math.max(2, initialCapacity)).fill(EMPTY);
  }

  get size(): number {
    return this.count;
  }

  set(key: K, value: V): this {
    if ((this.count + this.tombstones + 1) * 2 > this.slots.length) this.resize(this.slots.length * 2);

    let index = this.indexFor(key);
    let firstDeleted = -1;

    while (true) {
      const slot = this.slots[index]!;
      if (slot === EMPTY) break;
      if (slot === DELETED) {
        if (firstDeleted === -1) firstDeleted = index;
      } else if (slot.key === key) {
        slot.value = value;
        return this;
      }
      index = (index + 1) % this.slots.length;
    }

    if (firstDeleted !== -1) {
      index = firstDeleted;
      this.tombstones--;
    }

    this.slots[index] = { key, value };
    this.count++;
    return this;
  }

  get(key: K): V | undefined {
    const index = this.find(key);
    if (index === -1) return undefined;
    return (this.slots[index] as { value: V }).value;
  }

  has(key: K): boolean {
    return this.find(key) !== -1;
  }

  delete(key: K): boolean {
    const index = this.find(key);
    if (index === -1) return false;
    this.slots[index] = DELETED;
    this.count--;
    this.tombstones++;
    return true;
  }

  *[Symbol.iterator](): Generator<[K, V]> {
    for (const slot of this.slots) {
      if (slot !== EMPTY && slot !== DELETED) yield [slot.key, slot.value];
    }
  }

  private find(key: K): number {
    let index = this.indexFor(key);
    for (let probes = 0; probes < this.slots.length; probes++) {
      const slot = this.slots[index]!;
      if (slot === EMPTY) return -1;
      if (slot !== DELETED && slot.key === key) return index;
      index = (index + 1) % this.slots.length;
    }
    return -1;
  }

  private indexFor(key: K): number {
    return this.hasher(key) % this.slots.length;
  }

  private resize(capacity: number): void {
    const entries = [...this];
    this.slots = new Array(capacity).fill(EMPTY);
    this.count = 0;
    this.tombstones = 0;
    for (const [key, value] of entries) this.set(key, value);
  }
}
