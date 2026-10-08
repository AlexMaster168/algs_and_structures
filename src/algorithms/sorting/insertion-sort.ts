import { type Comparator, defaultCompare } from '../../shared/compare.js';

export const insertionSortRange = <T>(array: T[], left: number, right: number, compare: Comparator<T>): void => {
  for (let i = left + 1; i <= right; i++) {
    const current = array[i]!;
    let j = i - 1;
    while (j >= left && compare(array[j]!, current) > 0) {
      array[j + 1] = array[j]!;
      j--;
    }
    array[j + 1] = current;
  }
};

export const insertionSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const array = [...input];
  insertionSortRange(array, 0, array.length - 1, compare);
  return array;
};
