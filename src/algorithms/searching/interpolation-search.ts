export const interpolationSearch = (sorted: readonly number[], target: number): number => {
  let low = 0;
  let high = sorted.length - 1;

  while (low <= high && target >= sorted[low]! && target <= sorted[high]!) {
    if (sorted[high] === sorted[low]) return sorted[low] === target ? low : -1;

    const position = low + Math.floor(((target - sorted[low]!) * (high - low)) / (sorted[high]! - sorted[low]!));
    const value = sorted[position]!;

    if (value === target) return position;
    if (value < target) low = position + 1;
    else high = position - 1;
  }

  return -1;
};
