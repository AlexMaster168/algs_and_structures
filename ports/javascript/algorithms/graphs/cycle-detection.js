import { DisjointSet } from '../../data-structures/graphs/disjoint-set.js';
import { topologicalSortKahn } from './topological-sort.js';
export const hasCycleDirected = (graph) => topologicalSortKahn(graph) === null;
export const hasCycleUndirected = (vertexCount, edges) => {
    const sets = new DisjointSet(vertexCount);
    return edges.some(([a, b]) => !sets.union(a, b));
};
