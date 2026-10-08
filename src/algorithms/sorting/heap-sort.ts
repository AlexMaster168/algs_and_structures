import { type Comparator, defaultCompare } from '../../shared/compare.js';

const siftDown = <T>(array: T[], start: number, end: number, compare: Comparator<T>): void => {
  let root = start;
  while (true) {
    const left = 2 * root + 1;
    const right = left + 1;
    let largest = root;

    if (left < end && compare(array[left]!, array[largest]!) > 0) largest = left;
    if (right < end && compare(array[right]!, array[largest]!) > 0) largest = right;
    if (largest === root) return;

    [array[root], array[largest]] = [array[largest]!, array[root]!];
    root = largest;
  }
};

export const heapSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const array = [...input];

  for (let i = (array.length >> 1) - 1; i >= 0; i--) siftDown(array, i, array.length, compare);

  for (let end = array.length - 1; end > 0; end--) {
    [array[0], array[end]] = [array[end]!, array[0]!];
    siftDown(array, 0, end, compare);
  }

  return array;
};
