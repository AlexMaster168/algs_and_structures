import { type Comparator, defaultCompare } from '../../shared/compare.js';

class SkipListNode<T> {
  readonly next: (SkipListNode<T> | null)[];

  constructor(
    readonly value: T,
    level: number,
  ) {
    this.next = new Array(level).fill(null);
  }
}

export class SkipList<T> implements Iterable<T> {
  private readonly head: SkipListNode<T>;
  private level = 1;
  private length = 0;

  constructor(
    private readonly compare: Comparator<T> = defaultCompare,
    private readonly maxLevel = 32,
    private readonly probability = 0.5,
  ) {
    this.head = new SkipListNode<T>(undefined as T, maxLevel);
  }

  get size(): number {
    return this.length;
  }

  has(value: T): boolean {
    const candidate = this.findPredecessors(value)[0]!.next[0];
    return !!candidate && this.compare(candidate.value, value) === 0;
  }

  insert(value: T): boolean {
    const update = this.findPredecessors(value);
    const candidate = update[0]!.next[0];
    if (candidate && this.compare(candidate.value, value) === 0) return false;

    const level = this.randomLevel();
    if (level > this.level) {
      for (let i = this.level; i < level; i++) update[i] = this.head;
      this.level = level;
    }

    const node = new SkipListNode(value, level);
    for (let i = 0; i < level; i++) {
      node.next[i] = update[i]!.next[i] ?? null;
      update[i]!.next[i] = node;
    }

    this.length++;
    return true;
  }

  delete(value: T): boolean {
    const update = this.findPredecessors(value);
    const target = update[0]!.next[0];
    if (!target || this.compare(target.value, value) !== 0) return false;

    for (let i = 0; i < this.level; i++) {
      if (update[i]!.next[i] !== target) break;
      update[i]!.next[i] = target.next[i] ?? null;
    }

    while (this.level > 1 && !this.head.next[this.level - 1]) this.level--;
    this.length--;
    return true;
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    for (let node = this.head.next[0]; node; node = node.next[0]) yield node.value;
  }

  private findPredecessors(value: T): SkipListNode<T>[] {
    const update: SkipListNode<T>[] = new Array(this.maxLevel);
    let node = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      let next = node.next[i];
      while (next && this.compare(next.value, value) < 0) {
        node = next;
        next = node.next[i];
      }
      update[i] = node;
    }
    return update;
  }

  private randomLevel(): number {
    let level = 1;
    while (level < this.maxLevel && Math.random() < this.probability) level++;
    return level;
  }
}
