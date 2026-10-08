import { type Comparator, defaultCompare } from '../../shared/compare.js';

export const bubbleSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const array = [...input];

  for (let end = array.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      if (compare(array[i]!, array[i + 1]!) > 0) {
        [array[i], array[i + 1]] = [array[i + 1]!, array[i]!];
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  return array;
};
