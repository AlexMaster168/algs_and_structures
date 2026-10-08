import { type Comparator, defaultCompare } from '../../shared/compare.js';

export const cocktailShakerSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const array = [...input];
  let start = 0;
  let end = array.length - 1;
  let swapped = true;

  const swapIfGreater = (i: number): void => {
    if (compare(array[i]!, array[i + 1]!) > 0) {
      [array[i], array[i + 1]] = [array[i + 1]!, array[i]!];
      swapped = true;
    }
  };

  while (swapped && start < end) {
    swapped = false;
    for (let i = start; i < end; i++) swapIfGreater(i);
    end--;
    if (!swapped) break;

    swapped = false;
    for (let i = end - 1; i >= start; i--) swapIfGreater(i);
    start++;
  }

  return array;
};
