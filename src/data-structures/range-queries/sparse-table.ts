export class SparseTable<T> {
  private readonly table: T[][];
  private readonly log: number[];

  constructor(
    values: readonly T[],
    private readonly combine: (a: T, b: T) => T,
  ) {
    const n = values.length;
    this.log = new Array(n + 1).fill(0);
    for (let i = 2; i <= n; i++) this.log[i] = this.log[i >> 1]! + 1;

    this.table = [[...values]];
    for (let level = 1; 1 << level <= n; level++) {
      const previous = this.table[level - 1]!;
      const half = 1 << (level - 1);
      const row: T[] = [];
      for (let i = 0; i + (1 << level) <= n; i++) row.push(combine(previous[i]!, previous[i + half]!));
      this.table.push(row);
    }
  }

  query(left: number, right: number): T {
    if (left < 0 || right >= this.table[0]!.length || left > right) {
      throw new RangeError(`Invalid range [${left}, ${right}]`);
    }
    const level = this.log[right - left + 1]!;
    const row = this.table[level]!;
    return this.combine(row[left]!, row[right - (1 << level) + 1]!);
  }
}

export const minSparseTable = (values: readonly number[]) => new SparseTable(values, Math.min);

export const maxSparseTable = (values: readonly number[]) => new SparseTable(values, Math.max);
