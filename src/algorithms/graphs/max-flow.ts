export const edmondsKarp = (capacity: readonly (readonly number[])[], source: number, sink: number): number => {
  const n = capacity.length;
  const residual = capacity.map((row) => [...row]);
  let flow = 0;

  while (true) {
    const parent = new Array<number>(n).fill(-1);
    parent[source] = source;
    const queue = [source];

    for (let head = 0; head < queue.length && parent[sink] === -1; head++) {
      const vertex = queue[head]!;
      for (let next = 0; next < n; next++) {
        if (parent[next] === -1 && residual[vertex]![next]! > 0) {
          parent[next] = vertex;
          queue.push(next);
        }
      }
    }

    if (parent[sink] === -1) return flow;

    let bottleneck = Infinity;
    for (let v = sink; v !== source; v = parent[v]!) bottleneck = Math.min(bottleneck, residual[parent[v]!]![v]!);

    for (let v = sink; v !== source; v = parent[v]!) {
      residual[parent[v]!]![v]! -= bottleneck;
      residual[v]![parent[v]!]! += bottleneck;
    }

    flow += bottleneck;
  }
};
