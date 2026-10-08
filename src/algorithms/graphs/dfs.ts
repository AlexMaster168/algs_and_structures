import type { AdjacencyList } from './types.js';

export const dfs = (graph: AdjacencyList, start: number): number[] => {
  const visited = new Array<boolean>(graph.length).fill(false);
  const order: number[] = [];
  const stack = [start];

  while (stack.length) {
    const vertex = stack.pop()!;
    if (visited[vertex]) continue;
    visited[vertex] = true;
    order.push(vertex);

    const neighbors = graph[vertex]!;
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited[neighbors[i]!]) stack.push(neighbors[i]!);
    }
  }

  return order;
};

export const dfsRecursive = (graph: AdjacencyList, start: number): number[] => {
  const visited = new Array<boolean>(graph.length).fill(false);
  const order: number[] = [];

  const visit = (vertex: number): void => {
    visited[vertex] = true;
    order.push(vertex);
    for (const neighbor of graph[vertex]!) if (!visited[neighbor]) visit(neighbor);
  };

  visit(start);
  return order;
};

export const hasPath = (graph: AdjacencyList, from: number, to: number): boolean => dfs(graph, from).includes(to);
