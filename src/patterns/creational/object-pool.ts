export class ObjectPool<T> {
  private readonly available: T[] = [];
  private readonly inUse = new Set<T>();

  constructor(
    private readonly create: () => T,
    private readonly reset: (item: T) => void = () => {},
    private readonly maxSize = Infinity,
  ) {}

  get availableCount(): number {
    return this.available.length;
  }

  get inUseCount(): number {
    return this.inUse.size;
  }

  acquire(): T {
    let item = this.available.pop();
    if (item === undefined) {
      if (this.inUse.size >= this.maxSize) throw new Error('Pool is exhausted');
      item = this.create();
    }
    this.inUse.add(item);
    return item;
  }

  release(item: T): void {
    if (!this.inUse.delete(item)) throw new Error('Item does not belong to this pool');
    this.reset(item);
    this.available.push(item);
  }

  use<R>(work: (item: T) => R): R {
    const item = this.acquire();
    try {
      return work(item);
    } finally {
      this.release(item);
    }
  }
}
