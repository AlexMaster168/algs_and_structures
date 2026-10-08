import { type Comparator, defaultCompare } from '../../shared/compare.js';

export const shellSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const array = [...input];

  let gap = 1;
  while (gap < array.length / 3) gap = gap * 3 + 1;

  for (; gap >= 1; gap = (gap - 1) / 3) {
    for (let i = gap; i < array.length; i++) {
      const current = array[i]!;
      let j = i;
      while (j >= gap && compare(array[j - gap]!, current) > 0) {
        array[j] = array[j - gap]!;
        j -= gap;
      }
      array[j] = current;
    }
  }

  return array;
};
