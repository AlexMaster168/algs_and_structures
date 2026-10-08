import { Queue } from '../../data-structures/linear/queue.js';
import { type AdjacencyList, reconstructPath } from './types.js';

export interface BfsResult {
  order: number[];
  distance: number[];
  parent: number[];
}

export const bfs = (graph: AdjacencyList, start: number): BfsResult => {
  const distance = new Array<number>(graph.length).fill(-1);
  const parent = new Array<number>(graph.length).fill(-1);
  const order: number[] = [];
  const queue = new Queue<number>().enqueue(start);
  distance[start] = 0;

  while (!queue.isEmpty()) {
    const vertex = queue.dequeue()!;
    order.push(vertex);

    for (const neighbor of graph[vertex]!) {
      if (distance[neighbor] !== -1) continue;
      distance[neighbor] = distance[vertex]! + 1;
      parent[neighbor] = vertex;
      queue.enqueue(neighbor);
    }
  }

  return { order, distance, parent };
};

export const shortestPathUnweighted = (graph: AdjacencyList, start: number, target: number): number[] | null => {
  const { distance, parent } = bfs(graph, start);
  return distance[target] === -1 ? null : reconstructPath(parent, target);
};

export const gridShortestPath = (grid: readonly string[], start: [number, number], target: [number, number], wall = '#'): number => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const distance = Array.from({ length: rows }, () => new Array<number>(cols).fill(-1));
  const queue = new Queue<[number, number]>().enqueue(start);
  distance[start[0]]![start[1]] = 0;

  while (!queue.isEmpty()) {
    const [row, col] = queue.dequeue()!;
    if (row === target[0] && col === target[1]) return distance[row]![col]!;

    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (grid[r]![c] === wall || distance[r]![c] !== -1) continue;
      distance[r]![c] = distance[row]![col]! + 1;
      queue.enqueue([r, c]);
    }
  }

  return -1;
};
