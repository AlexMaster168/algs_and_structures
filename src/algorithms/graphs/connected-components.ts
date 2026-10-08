import type { AdjacencyList } from './types.js';

export const connectedComponents = (graph: AdjacencyList): number[][] => {
  const visited = new Array<boolean>(graph.length).fill(false);
  const components: number[][] = [];

  for (let start = 0; start < graph.length; start++) {
    if (visited[start]) continue;

    const component: number[] = [];
    const stack = [start];
    visited[start] = true;

    while (stack.length) {
      const vertex = stack.pop()!;
      component.push(vertex);
      for (const neighbor of graph[vertex]!) {
        if (visited[neighbor]) continue;
        visited[neighbor] = true;
        stack.push(neighbor);
      }
    }

    components.push(component.sort((a, b) => a - b));
  }

  return components;
};
