import { type Comparator, defaultCompare } from '../../shared/compare.js';

export const binarySearch = <T>(
  sorted: readonly T[],
  target: T,
  compare: Comparator<T> = defaultCompare,
  low = 0,
  high = sorted.length - 1,
): number => {
  while (low <= high) {
    const mid = low + ((high - low) >> 1);
    const order = compare(sorted[mid]!, target);
    if (order === 0) return mid;
    if (order < 0) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
};

export const binarySearchRecursive = <T>(
  sorted: readonly T[],
  target: T,
  compare: Comparator<T> = defaultCompare,
  low = 0,
  high = sorted.length - 1,
): number => {
  if (low > high) return -1;
  const mid = low + ((high - low) >> 1);
  const order = compare(sorted[mid]!, target);
  if (order === 0) return mid;
  return order < 0
    ? binarySearchRecursive(sorted, target, compare, mid + 1, high)
    : binarySearchRecursive(sorted, target, compare, low, mid - 1);
};

export const lowerBound = <T>(sorted: readonly T[], target: T, compare: Comparator<T> = defaultCompare): number => {
  let low = 0;
  let high = sorted.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (compare(sorted[mid]!, target) < 0) low = mid + 1;
    else high = mid;
  }
  return low;
};

export const upperBound = <T>(sorted: readonly T[], target: T, compare: Comparator<T> = defaultCompare): number => {
  let low = 0;
  let high = sorted.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (compare(sorted[mid]!, target) <= 0) low = mid + 1;
    else high = mid;
  }
  return low;
};

export const firstTrue = (low: number, high: number, predicate: (value: number) => boolean): number => {
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (predicate(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
};
