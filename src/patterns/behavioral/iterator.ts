export interface ClassicIterator<T> {
  hasNext(): boolean;
  next(): T;
}

export class NumberRange implements Iterable<number> {
  constructor(
    private readonly start: number,
    private readonly end: number,
    private readonly step = 1,
  ) {
    if (step === 0) throw new RangeError('Step must not be zero');
  }

  createIterator(): ClassicIterator<number> {
    let current = this.start;
    const { end, step } = this;
    return {
      hasNext: () => (step > 0 ? current < end : current > end),
      next: () => {
        const value = current;
        current += step;
        return value;
      },
    };
  }

  *[Symbol.iterator](): Generator<number> {
    const iterator = this.createIterator();
    while (iterator.hasNext()) yield iterator.next();
  }
}

export interface TreeItem<T> {
  value: T;
  children?: TreeItem<T>[];
}

export function* depthFirst<T>(roots: readonly TreeItem<T>[]): Generator<T> {
  for (const root of roots) {
    yield root.value;
    yield* depthFirst(root.children ?? []);
  }
}

export function* breadthFirst<T>(roots: readonly TreeItem<T>[]): Generator<T> {
  const queue = [...roots];
  for (let head = 0; head < queue.length; head++) {
    const item = queue[head]!;
    yield item.value;
    queue.push(...(item.children ?? []));
  }
}

export function* take<T>(source: Iterable<T>, count: number): Generator<T> {
  if (count <= 0) return;
  for (const item of source) {
    yield item;
    if (--count === 0) return;
  }
}
