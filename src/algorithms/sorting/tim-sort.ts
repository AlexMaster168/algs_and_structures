import { type Comparator, defaultCompare } from '../../shared/compare.js';
import { insertionSortRange } from './insertion-sort.js';

const MIN_MERGE = 32;

const minRunLength = (n: number): number => {
  let remainder = 0;
  while (n >= MIN_MERGE) {
    remainder |= n & 1;
    n >>= 1;
  }
  return n + remainder;
};

const mergeRuns = <T>(array: T[], left: number, middle: number, right: number, compare: Comparator<T>): void => {
  const leftPart = array.slice(left, middle + 1);
  const rightPart = array.slice(middle + 1, right + 1);
  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftPart.length && j < rightPart.length) {
    array[k++] = compare(leftPart[i]!, rightPart[j]!) <= 0 ? leftPart[i++]! : rightPart[j++]!;
  }
  while (i < leftPart.length) array[k++] = leftPart[i++]!;
  while (j < rightPart.length) array[k++] = rightPart[j++]!;
};

export const timSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const array = [...input];
  const n = array.length;
  const run = minRunLength(n);

  for (let start = 0; start < n; start += run) {
    insertionSortRange(array, start, Math.min(start + run - 1, n - 1), compare);
  }

  for (let size = run; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const middle = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (middle < right) mergeRuns(array, left, middle, right, compare);
    }
  }

  return array;
};
