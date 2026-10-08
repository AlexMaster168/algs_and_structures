export type AdjacencyList = readonly (readonly number[])[];

export interface WeightedEdge {
  to: number;
  weight: number;
}

export type WeightedAdjacencyList = readonly (readonly WeightedEdge[])[];

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export const reconstructPath = (parent: readonly number[], target: number): number[] => {
  const path: number[] = [];
  for (let vertex = target; vertex !== -1; vertex = parent[vertex]!) path.push(vertex);
  return path.reverse();
};

export const toUndirected = (vertexCount: number, edges: readonly [number, number][]): number[][] => {
  const graph: number[][] = Array.from({ length: vertexCount }, () => []);
  for (const [a, b] of edges) {
    graph[a]!.push(b);
    graph[b]!.push(a);
  }
  return graph;
};

export const toWeightedUndirected = (vertexCount: number, edges: readonly Edge[]): WeightedEdge[][] => {
  const graph: WeightedEdge[][] = Array.from({ length: vertexCount }, () => []);
  for (const { from, to, weight } of edges) {
    graph[from]!.push({ to, weight });
    graph[to]!.push({ to: from, weight });
  }
  return graph;
};
