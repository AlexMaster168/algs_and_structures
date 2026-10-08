import { BinaryHeap } from '../../data-structures/heaps/binary-heap.js';

export interface AStarOptions<N> {
  start: N;
  goal: N;
  neighbors: (node: N) => Iterable<{ node: N; cost: number }>;
  heuristic: (node: N) => number;
  key?: (node: N) => string | number;
}

export const aStar = <N>({
  start,
  goal,
  neighbors,
  heuristic,
  key = (node) => String(node),
}: AStarOptions<N>): { path: N[]; cost: number } | null => {
  const goalKey = key(goal);
  const bestCost = new Map<string | number, number>([[key(start), 0]]);
  const cameFrom = new Map<string | number, N>();
  const open = new BinaryHeap<{ node: N; cost: number; estimate: number }>((a, b) => a.estimate - b.estimate);
  open.push({ node: start, cost: 0, estimate: heuristic(start) });

  while (!open.isEmpty()) {
    const { node, cost } = open.pop()!;
    const nodeKey = key(node);
    if (cost > bestCost.get(nodeKey)!) continue;

    if (nodeKey === goalKey) {
      const path = [node];
      for (let current = cameFrom.get(nodeKey); current !== undefined; current = cameFrom.get(key(current))) {
        path.push(current);
      }
      return { path: path.reverse(), cost };
    }

    for (const next of neighbors(node)) {
      const nextKey = key(next.node);
      const nextCost = cost + next.cost;
      if (nextCost < (bestCost.get(nextKey) ?? Infinity)) {
        bestCost.set(nextKey, nextCost);
        cameFrom.set(nextKey, node);
        open.push({ node: next.node, cost: nextCost, estimate: nextCost + heuristic(next.node) });
      }
    }
  }

  return null;
};

export type Cell = readonly [row: number, col: number];

export const aStarGrid = (grid: readonly string[], start: Cell, goal: Cell, wall = '#'): Cell[] | null => {
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

  const result = aStar<Cell>({
    start,
    goal,
    key: ([row, col]) => `${row},${col}`,
    heuristic: ([row, col]) => Math.abs(row - goal[0]) + Math.abs(col - goal[1]),
    neighbors: ([row, col]) =>
      directions
        .map(([dr, dc]) => [row + dr, col + dc] as const)
        .filter(([r, c]) => grid[r]?.[c] !== undefined && grid[r]![c] !== wall)
        .map((node) => ({ node, cost: 1 })),
  });

  return result?.path ?? null;
};
