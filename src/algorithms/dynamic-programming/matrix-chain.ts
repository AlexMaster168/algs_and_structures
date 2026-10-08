export const matrixChainOrder = (dimensions: readonly number[]): { cost: number; order: string } => {
  const n = dimensions.length - 1;
  if (n < 1) return { cost: 0, order: '' };

  const cost = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const split = Array.from({ length: n }, () => new Array<number>(n).fill(0));

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i + length - 1 < n; i++) {
      const j = i + length - 1;
      cost[i]![j] = Infinity;
      for (let k = i; k < j; k++) {
        const candidate = cost[i]![k]! + cost[k + 1]![j]! + dimensions[i]! * dimensions[k + 1]! * dimensions[j + 1]!;
        if (candidate < cost[i]![j]!) {
          cost[i]![j] = candidate;
          split[i]![j] = k;
        }
      }
    }
  }

  const render = (i: number, j: number): string =>
    i === j ? `A${i + 1}` : `(${render(i, split[i]![j]!)}${render(split[i]![j]! + 1, j)})`;

  return { cost: cost[0]![n - 1]!, order: render(0, n - 1) };
};
