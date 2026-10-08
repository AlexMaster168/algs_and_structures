export class LazySegmentTree {
  private readonly n: number;
  private readonly sums: number[];
  private readonly pending: number[];

  constructor(values: readonly number[]) {
    this.n = values.length;
    this.sums = new Array(4 * Math.max(1, this.n)).fill(0);
    this.pending = new Array(4 * Math.max(1, this.n)).fill(0);
    if (this.n > 0) this.build(1, 0, this.n - 1, values);
  }

  get size(): number {
    return this.n;
  }

  rangeAdd(left: number, right: number, delta: number): void {
    this.assertRange(left, right);
    this.add(1, 0, this.n - 1, left, right, delta);
  }

  rangeSum(left: number, right: number): number {
    this.assertRange(left, right);
    return this.sum(1, 0, this.n - 1, left, right);
  }

  private build(node: number, start: number, end: number, values: readonly number[]): void {
    if (start === end) {
      this.sums[node] = values[start]!;
      return;
    }
    const mid = (start + end) >> 1;
    this.build(2 * node, start, mid, values);
    this.build(2 * node + 1, mid + 1, end, values);
    this.sums[node] = this.sums[2 * node]! + this.sums[2 * node + 1]!;
  }

  private apply(node: number, start: number, end: number, delta: number): void {
    this.sums[node]! += delta * (end - start + 1);
    this.pending[node]! += delta;
  }

  private push(node: number, start: number, end: number): void {
    const delta = this.pending[node]!;
    if (delta === 0) return;
    const mid = (start + end) >> 1;
    this.apply(2 * node, start, mid, delta);
    this.apply(2 * node + 1, mid + 1, end, delta);
    this.pending[node] = 0;
  }

  private add(node: number, start: number, end: number, left: number, right: number, delta: number): void {
    if (right < start || end < left) return;
    if (left <= start && end <= right) {
      this.apply(node, start, end, delta);
      return;
    }

    this.push(node, start, end);
    const mid = (start + end) >> 1;
    this.add(2 * node, start, mid, left, right, delta);
    this.add(2 * node + 1, mid + 1, end, left, right, delta);
    this.sums[node] = this.sums[2 * node]! + this.sums[2 * node + 1]!;
  }

  private sum(node: number, start: number, end: number, left: number, right: number): number {
    if (right < start || end < left) return 0;
    if (left <= start && end <= right) return this.sums[node]!;

    this.push(node, start, end);
    const mid = (start + end) >> 1;
    return this.sum(2 * node, start, mid, left, right) + this.sum(2 * node + 1, mid + 1, end, left, right);
  }

  private assertRange(left: number, right: number): void {
    if (left < 0 || right >= this.n || left > right) throw new RangeError(`Invalid range [${left}, ${right}]`);
  }
}
