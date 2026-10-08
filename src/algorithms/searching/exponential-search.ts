import { type Comparator, defaultCompare } from '../../shared/compare.js';
import { binarySearch } from './binary-search.js';

export const exponentialSearch = <T>(sorted: readonly T[], target: T, compare: Comparator<T> = defaultCompare): number => {
  if (sorted.length === 0) return -1;
  if (compare(sorted[0]!, target) === 0) return 0;

  let bound = 1;
  while (bound < sorted.length && compare(sorted[bound]!, target) < 0) bound *= 2;

  return binarySearch(sorted, target, compare, bound >> 1, Math.min(bound, sorted.length - 1));
};
