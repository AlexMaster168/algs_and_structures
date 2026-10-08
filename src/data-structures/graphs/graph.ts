export interface GraphEdge<V> {
  from: V;
  to: V;
  weight: number;
}

export class Graph<V> {
  private readonly adjacency = new Map<V, Map<V, number>>();

  constructor(readonly directed = false) {}

  get vertexCount(): number {
    return this.adjacency.size;
  }

  get edgeCount(): number {
    return this.edges().length;
  }

  addVertex(vertex: V): this {
    if (!this.adjacency.has(vertex)) this.adjacency.set(vertex, new Map());
    return this;
  }

  addEdge(from: V, to: V, weight = 1): this {
    this.addVertex(from).addVertex(to);
    this.adjacency.get(from)!.set(to, weight);
    if (!this.directed) this.adjacency.get(to)!.set(from, weight);
    return this;
  }

  removeEdge(from: V, to: V): boolean {
    const removed = this.adjacency.get(from)?.delete(to) ?? false;
    if (removed && !this.directed) this.adjacency.get(to)!.delete(from);
    return removed;
  }

  removeVertex(vertex: V): boolean {
    if (!this.adjacency.delete(vertex)) return false;
    for (const neighbors of this.adjacency.values()) neighbors.delete(vertex);
    return true;
  }

  hasVertex(vertex: V): boolean {
    return this.adjacency.has(vertex);
  }

  hasEdge(from: V, to: V): boolean {
    return this.adjacency.get(from)?.has(to) ?? false;
  }

  weight(from: V, to: V): number | undefined {
    return this.adjacency.get(from)?.get(to);
  }

  neighbors(vertex: V): V[] {
    return [...(this.adjacency.get(vertex)?.keys() ?? [])];
  }

  degree(vertex: V): number {
    return this.adjacency.get(vertex)?.size ?? 0;
  }

  vertices(): V[] {
    return [...this.adjacency.keys()];
  }

  edges(): GraphEdge<V>[] {
    const result: GraphEdge<V>[] = [];
    const seen = new Set<V>();

    for (const [from, neighbors] of this.adjacency) {
      for (const [to, weight] of neighbors) {
        if (!this.directed && seen.has(to)) continue;
        result.push({ from, to, weight });
      }
      seen.add(from);
    }

    return result;
  }

  toAdjacencyMatrix(): { vertices: V[]; matrix: number[][] } {
    const vertices = this.vertices();
    const index = new Map(vertices.map((vertex, i) => [vertex, i]));
    const matrix = vertices.map(() => new Array<number>(vertices.length).fill(0));

    for (const [from, neighbors] of this.adjacency) {
      for (const [to, weight] of neighbors) matrix[index.get(from)!]![index.get(to)!] = weight;
    }

    return { vertices, matrix };
  }

  toAdjacencyList(): { vertices: V[]; list: number[][] } {
    const vertices = this.vertices();
    const index = new Map(vertices.map((vertex, i) => [vertex, i]));
    const list = vertices.map((vertex) => this.neighbors(vertex).map((neighbor) => index.get(neighbor)!));
    return { vertices, list };
  }
}
