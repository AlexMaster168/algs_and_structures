import { DisjointSet } from '../../data-structures/graphs/disjoint-set.js';
import { topologicalSortKahn } from './topological-sort.js';
import type { AdjacencyList } from './types.js';

export const hasCycleDirected = (graph: AdjacencyList): boolean => topologicalSortKahn(graph) === null;

export const hasCycleUndirected = (vertexCount: number, edges: readonly [number, number][]): boolean => {
  const sets = new DisjointSet(vertexCount);
  return edges.some(([a, b]) => !sets.union(a, b));
};
