import type { AdjacencyList } from '../graphs/types.js';

export class LowestCommonAncestor {
  private readonly depth: number[];
  private readonly up: number[][];
  private readonly levels: number;

  constructor(tree: AdjacencyList, root = 0) {
    const n = tree.length;
    this.levels = Math.max(1, Math.ceil(Math.log2(n + 1)));
    this.depth = new Array<number>(n).fill(-1);
    this.up = Array.from({ length: this.levels }, () => new Array<number>(n).fill(root));

    const order = [root];
    this.depth[root] = 0;
    for (let head = 0; head < order.length; head++) {
      const vertex = order[head]!;
      for (const child of tree[vertex]!) {
        if (this.depth[child] !== -1) continue;
        this.depth[child] = this.depth[vertex]! + 1;
        this.up[0]![child] = vertex;
        order.push(child);
      }
    }

    for (let k = 1; k < this.levels; k++) {
      for (let v = 0; v < n; v++) this.up[k]![v] = this.up[k - 1]![this.up[k - 1]![v]!]!;
    }
  }

  ancestor(vertex: number, steps: number): number {
    for (let k = 0; k < this.levels && steps > 0; k++, steps >>= 1) {
      if (steps & 1) vertex = this.up[k]![vertex]!;
    }
    return vertex;
  }

  lca(a: number, b: number): number {
    if (this.depth[a]! < this.depth[b]!) [a, b] = [b, a];
    a = this.ancestor(a, this.depth[a]! - this.depth[b]!);
    if (a === b) return a;

    for (let k = this.levels - 1; k >= 0; k--) {
      if (this.up[k]![a] !== this.up[k]![b]) {
        a = this.up[k]![a]!;
        b = this.up[k]![b]!;
      }
    }

    return this.up[0]![a]!;
  }

  distance(a: number, b: number): number {
    return this.depth[a]! + this.depth[b]! - 2 * this.depth[this.lca(a, b)]!;
  }
}
