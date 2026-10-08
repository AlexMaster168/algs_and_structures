export const longestIncreasingSubsequence = (values: readonly number[]): number[] => {
  const tailIndices: number[] = [];
  const previous = new Array<number>(values.length).fill(-1);

  values.forEach((value, i) => {
    let low = 0;
    let high = tailIndices.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (values[tailIndices[mid]!]! < value) low = mid + 1;
      else high = mid;
    }

    if (low > 0) previous[i] = tailIndices[low - 1]!;
    tailIndices[low] = i;
  });

  const result: number[] = [];
  for (let i = tailIndices[tailIndices.length - 1] ?? -1; i !== -1; i = previous[i]!) result.push(values[i]!);
  return result.reverse();
};
