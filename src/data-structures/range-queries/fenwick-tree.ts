export class FenwickTree {
  private readonly tree: number[];

  constructor(sizeOrValues: number | readonly number[]) {
    if (typeof sizeOrValues === 'number') {
      this.tree = new Array(sizeOrValues + 1).fill(0);
      return;
    }

    const n = sizeOrValues.length;
    this.tree = [0, ...sizeOrValues];
    for (let i = 1; i <= n; i++) {
      const parent = i + (i & -i);
      if (parent <= n) this.tree[parent]! += this.tree[i]!;
    }
  }

  get size(): number {
    return this.tree.length - 1;
  }

  add(index: number, delta: number): void {
    for (let i = index + 1; i < this.tree.length; i += i & -i) this.tree[i]! += delta;
  }

  set(index: number, value: number): void {
    this.add(index, value - this.rangeSum(index, index));
  }

  prefixSum(index: number): number {
    let sum = 0;
    for (let i = Math.min(index + 1, this.size); i > 0; i -= i & -i) sum += this.tree[i]!;
    return sum;
  }

  rangeSum(left: number, right: number): number {
    return this.prefixSum(right) - (left > 0 ? this.prefixSum(left - 1) : 0);
  }
}
