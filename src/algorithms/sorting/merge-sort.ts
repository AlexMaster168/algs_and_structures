import { type Comparator, defaultCompare } from '../../shared/compare.js';

export const merge = <T>(left: readonly T[], right: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compare(left[i]!, right[j]!) <= 0) result.push(left[i++]!);
    else result.push(right[j++]!);
  }

  while (i < left.length) result.push(left[i++]!);
  while (j < right.length) result.push(right[j++]!);
  return result;
};

export const mergeSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  if (input.length <= 1) return [...input];
  const middle = input.length >> 1;
  return merge(mergeSort(input.slice(0, middle), compare), mergeSort(input.slice(middle), compare), compare);
};

export const bottomUpMergeSort = <T>(input: readonly T[], compare: Comparator<T> = defaultCompare): T[] => {
  let source = [...input];
  let target: T[] = new Array(source.length);

  for (let width = 1; width < source.length; width *= 2) {
    for (let left = 0; left < source.length; left += 2 * width) {
      const middle = Math.min(left + width, source.length);
      const right = Math.min(left + 2 * width, source.length);
      let i = left;
      let j = middle;
      let k = left;

      while (i < middle && j < right) target[k++] = compare(source[i]!, source[j]!) <= 0 ? source[i++]! : source[j++]!;
      while (i < middle) target[k++] = source[i++]!;
      while (j < right) target[k++] = source[j++]!;
    }
    [source, target] = [target, source];
  }

  return source;
};
