import type { AdjacencyList } from './types.js';

export const bipartiteColoring = (graph: AdjacencyList): (0 | 1)[] | null => {
  const colors = new Array<0 | 1 | -1>(graph.length).fill(-1);

  for (let start = 0; start < graph.length; start++) {
    if (colors[start] !== -1) continue;
    colors[start] = 0;
    const queue = [start];

    for (let head = 0; head < queue.length; head++) {
      const vertex = queue[head]!;
      for (const neighbor of graph[vertex]!) {
        if (colors[neighbor] === -1) {
          colors[neighbor] = colors[vertex] === 0 ? 1 : 0;
          queue.push(neighbor);
        } else if (colors[neighbor] === colors[vertex]) {
          return null;
        }
      }
    }
  }

  return colors as (0 | 1)[];
};

export const isBipartite = (graph: AdjacencyList): boolean => bipartiteColoring(graph) !== null;
