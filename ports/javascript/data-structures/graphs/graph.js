export class Graph {
    directed;
    adjacency = new Map();
    constructor(directed = false) {
        this.directed = directed;
    }
    get vertexCount() {
        return this.adjacency.size;
    }
    get edgeCount() {
        return this.edges().length;
    }
    addVertex(vertex) {
        if (!this.adjacency.has(vertex))
            this.adjacency.set(vertex, new Map());
        return this;
    }
    addEdge(from, to, weight = 1) {
        this.addVertex(from).addVertex(to);
        this.adjacency.get(from).set(to, weight);
        if (!this.directed)
            this.adjacency.get(to).set(from, weight);
        return this;
    }
    removeEdge(from, to) {
        const removed = this.adjacency.get(from)?.delete(to) ?? false;
        if (removed && !this.directed)
            this.adjacency.get(to).delete(from);
        return removed;
    }
    removeVertex(vertex) {
        if (!this.adjacency.delete(vertex))
            return false;
        for (const neighbors of this.adjacency.values())
            neighbors.delete(vertex);
        return true;
    }
    hasVertex(vertex) {
        return this.adjacency.has(vertex);
    }
    hasEdge(from, to) {
        return this.adjacency.get(from)?.has(to) ?? false;
    }
    weight(from, to) {
        return this.adjacency.get(from)?.get(to);
    }
    neighbors(vertex) {
        return [...(this.adjacency.get(vertex)?.keys() ?? [])];
    }
    degree(vertex) {
        return this.adjacency.get(vertex)?.size ?? 0;
    }
    vertices() {
        return [...this.adjacency.keys()];
    }
    edges() {
        const result = [];
        const seen = new Set();
        for (const [from, neighbors] of this.adjacency) {
            for (const [to, weight] of neighbors) {
                if (!this.directed && seen.has(to))
                    continue;
                result.push({ from, to, weight });
            }
            seen.add(from);
        }
        return result;
    }
    toAdjacencyMatrix() {
        const vertices = this.vertices();
        const index = new Map(vertices.map((vertex, i) => [vertex, i]));
        const matrix = vertices.map(() => new Array(vertices.length).fill(0));
        for (const [from, neighbors] of this.adjacency) {
            for (const [to, weight] of neighbors)
                matrix[index.get(from)][index.get(to)] = weight;
        }
        return { vertices, matrix };
    }
    toAdjacencyList() {
        const vertices = this.vertices();
        const index = new Map(vertices.map((vertex, i) => [vertex, i]));
        const list = vertices.map((vertex) => this.neighbors(vertex).map((neighbor) => index.get(neighbor)));
        return { vertices, list };
    }
}
