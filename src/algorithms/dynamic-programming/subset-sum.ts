export const subsetSum = (values: readonly number[], target: number): number[] | null => {
  const reachedBy = new Array<number>(target + 1).fill(-1);
  const reachable = new Array<boolean>(target + 1).fill(false);
  reachable[0] = true;

  values.forEach((value, index) => {
    for (let sum = target; sum >= value; sum--) {
      if (!reachable[sum] && reachable[sum - value]) {
        reachable[sum] = true;
        reachedBy[sum] = index;
      }
    }
  });

  if (!reachable[target]) return null;

  const chosen: number[] = [];
  for (let sum = target; sum > 0; sum -= values[reachedBy[sum]!]!) chosen.push(values[reachedBy[sum]!]!);
  return chosen.reverse();
};

export const canPartition = (values: readonly number[]): boolean => {
  const total = values.reduce((a, b) => a + b, 0);
  return total % 2 === 0 && subsetSum(values, total / 2) !== null;
};
