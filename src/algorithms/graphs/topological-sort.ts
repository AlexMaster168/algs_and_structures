import type { AdjacencyList } from './types.js';

export const topologicalSortKahn = (graph: AdjacencyList): number[] | null => {
  const inDegree = new Array<number>(graph.length).fill(0);
  for (const neighbors of graph) for (const neighbor of neighbors) inDegree[neighbor]!++;

  const queue: number[] = [];
  inDegree.forEach((degree, vertex) => degree === 0 && queue.push(vertex));

  const order: number[] = [];
  for (let head = 0; head < queue.length; head++) {
    const vertex = queue[head]!;
    order.push(vertex);
    for (const neighbor of graph[vertex]!) {
      if (--inDegree[neighbor]! === 0) queue.push(neighbor);
    }
  }

  return order.length === graph.length ? order : null;
};

export const topologicalSortDfs = (graph: AdjacencyList): number[] | null => {
  const state = new Array<0 | 1 | 2>(graph.length).fill(0);
  const order: number[] = [];

  const visit = (vertex: number): boolean => {
    state[vertex] = 1;
    for (const neighbor of graph[vertex]!) {
      if (state[neighbor] === 1) return false;
      if (state[neighbor] === 0 && !visit(neighbor)) return false;
    }
    state[vertex] = 2;
    order.push(vertex);
    return true;
  };

  for (let vertex = 0; vertex < graph.length; vertex++) {
    if (state[vertex] === 0 && !visit(vertex)) return null;
  }

  return order.reverse();
};
