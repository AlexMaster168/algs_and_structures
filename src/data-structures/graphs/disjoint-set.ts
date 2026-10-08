export class DisjointSet {
  private readonly parent: number[];
  private readonly sizes: number[];
  private sets: number;

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.sizes = new Array(size).fill(1);
    this.sets = size;
  }

  get count(): number {
    return this.sets;
  }

  find(x: number): number {
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root]!;

    while (this.parent[x] !== root) {
      const next = this.parent[x]!;
      this.parent[x] = root;
      x = next;
    }

    return root;
  }

  union(a: number, b: number): boolean {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;

    if (this.sizes[rootA]! < this.sizes[rootB]!) [rootA, rootB] = [rootB, rootA];
    this.parent[rootB] = rootA;
    this.sizes[rootA]! += this.sizes[rootB]!;
    this.sets--;
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  sizeOf(x: number): number {
    return this.sizes[this.find(x)]!;
  }
}
