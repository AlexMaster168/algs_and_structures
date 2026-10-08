export const twoSumSorted = (sorted: readonly number[], target: number): [number, number] | null => {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left]! + sorted[right]!;
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
};

export const twoSum = (values: readonly number[], target: number): [number, number] | null => {
  const seen = new Map<number, number>();
  for (let i = 0; i < values.length; i++) {
    const j = seen.get(target - values[i]!);
    if (j !== undefined) return [j, i];
    seen.set(values[i]!, i);
  }
  return null;
};

export const threeSum = (values: readonly number[], target = 0): [number, number, number][] => {
  const sorted = [...values].sort((a, b) => a - b);
  const result: [number, number, number][] = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i]! + sorted[left]! + sorted[right]!;
      if (sum < target) left++;
      else if (sum > target) right--;
      else {
        result.push([sorted[i]!, sorted[left]!, sorted[right]!]);
        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;
        left++;
        right--;
      }
    }
  }

  return result;
};

export const containerWithMostWater = (heights: readonly number[]): number => {
  let best = 0;
  for (let left = 0, right = heights.length - 1; left < right; ) {
    best = Math.max(best, Math.min(heights[left]!, heights[right]!) * (right - left));
    if (heights[left]! < heights[right]!) left++;
    else right--;
  }
  return best;
};

export const removeDuplicatesSorted = (sorted: number[]): number => {
  let write = 0;
  for (let read = 0; read < sorted.length; read++) {
    if (read === 0 || sorted[read] !== sorted[write - 1]) sorted[write++] = sorted[read]!;
  }
  sorted.length = write;
  return write;
};

export const dutchNationalFlag = (values: number[], pivot: number): number[] => {
  let low = 0;
  let mid = 0;
  let high = values.length - 1;
  const swap = (i: number, j: number): void => {
    [values[i], values[j]] = [values[j]!, values[i]!];
  };

  while (mid <= high) {
    if (values[mid]! < pivot) swap(low++, mid++);
    else if (values[mid]! > pivot) swap(mid, high--);
    else mid++;
  }
  return values;
};

export const hasCycleFloyd = <T>(start: T, next: (node: T) => T | null): boolean => {
  let slow: T | null = start;
  let fast: T | null = start;
  while (fast !== null) {
    fast = next(fast);
    if (fast === null) return false;
    fast = next(fast);
    slow = next(slow!);
    if (fast !== null && fast === slow) return true;
  }
  return false;
};
