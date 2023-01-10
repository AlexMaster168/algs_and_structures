class SegmentTree {
  private tree: number[];
  private data: number[];

  constructor(data: number[]) {
    this.data = data;
    this.tree = new Array(data.length * 4);
    this.buildTree(0, 0, data.length - 1);
  }

  public query(start: number, end: number): number {
    return this.queryTree(0, 0, this.data.length - 1, start, end);
  }

  public update(index: number, value: number): void {
    this.data[index] = value;
    this.updateTree(0, 0, this.data.length - 1, index, value);
  }

  private buildTree(node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = this.data[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    this.buildTree(node * 2 + 1, start, mid);
    this.buildTree(node * 2 + 2, mid + 1, end);
    this.tree[node] = Math.min(this.tree[node * 2 + 1], this.tree[node * 2 + 2]);
  }

  private queryTree(node: number, start: number, end: number, queryStart: number, queryEnd: number): number {
    if (queryStart <= start && end <= queryEnd) {
      return this.tree[node];
    }
    if (end < queryStart || queryEnd < start) {
      return Infinity;
    }
    const mid = Math.floor((start + end) / 2);
    return Math.min(
      this.queryTree(node * 2 + 1, start, mid, queryStart, queryEnd),
      this.queryTree(node * 2 + 2, mid + 1, end, queryStart, queryEnd)
    );
  }

  private updateTree(node: number, start: number, end: number, index: number, value: number): void {
    if (start === end) {
      this.tree[node] = value;
      return;
    }
    const mid = Math.floor((start + end) / 2);
