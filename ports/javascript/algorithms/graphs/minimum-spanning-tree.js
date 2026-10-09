import { DisjointSet } from '../../data-structures/graphs/disjoint-set.js';
import { BinaryHeap } from '../../data-structures/heaps/binary-heap.js';
export const kruskal = (vertexCount, edges) => {
    const sets = new DisjointSet(vertexCount);
    const result = [];
    let weight = 0;
    for (const edge of [...edges].sort((a, b) => a.weight - b.weight)) {
        if (!sets.union(edge.from, edge.to))
            continue;
        result.push(edge);
        weight += edge.weight;
        if (result.length === vertexCount - 1)
            break;
    }
    return { weight, edges: result };
};
export const prim = (graph, start = 0) => {
    const visited = new Array(graph.length).fill(false);
    const heap = new BinaryHeap((a, b) => a.weight - b.weight);
    const result = [];
    let weight = 0;
    const visit = (vertex) => {
        visited[vertex] = true;
        for (const { to, weight } of graph[vertex]) {
            if (!visited[to])
                heap.push({ from: vertex, to, weight });
        }
    };
    visit(start);
    while (!heap.isEmpty() && result.length < graph.length - 1) {
        const edge = heap.pop();
        if (visited[edge.to])
            continue;
        result.push(edge);
        weight += edge.weight;
        visit(edge.to);
    }
    return { weight, edges: result };
};
