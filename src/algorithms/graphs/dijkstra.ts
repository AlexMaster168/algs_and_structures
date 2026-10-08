import { BinaryHeap } from '../../data-structures/heaps/binary-heap.js';
import { reconstructPath, type WeightedAdjacencyList } from './types.js';

export interface ShortestPaths {
  distance: number[];
  parent: number[];
}

export const dijkstra = (graph: WeightedAdjacencyList, source: number): ShortestPaths => {
  const distance = new Array<number>(graph.length).fill(Infinity);
  const parent = new Array<number>(graph.length).fill(-1);
  const heap = new BinaryHeap<[vertex: number, distance: number]>((a, b) => a[1] - b[1]);

  distance[source] = 0;
  heap.push([source, 0]);

  while (!heap.isEmpty()) {
    const [vertex, current] = heap.pop()!;
    if (current > distance[vertex]!) continue;

    for (const { to, weight } of graph[vertex]!) {
      if (weight < 0) throw new RangeError('Dijkstra does not support negative weights');
      const candidate = current + weight;
      if (candidate < distance[to]!) {
        distance[to] = candidate;
        parent[to] = vertex;
        heap.push([to, candidate]);
      }
    }
  }

  return { distance, parent };
};

export const dijkstraPath = (
  graph: WeightedAdjacencyList,
  source: number,
  target: number,
): { distance: number; path: number[] } | null => {
  const { distance, parent } = dijkstra(graph, source);
  if (distance[target] === Infinity) return null;
  return { distance: distance[target]!, path: reconstructPath(parent, target) };
};
