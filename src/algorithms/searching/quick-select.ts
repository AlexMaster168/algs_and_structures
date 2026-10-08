import { type Comparator, defaultCompare } from '../../shared/compare.js';
import { lomutoPartition } from '../sorting/quick-sort.js';

export const quickSelect = <T>(input: readonly T[], k: number, compare: Comparator<T> = defaultCompare): T => {
  if (k < 0 || k >= input.length) throw new RangeError(`k=${k} is out of bounds`);

  const array = [...input];
  let low = 0;
  let high = array.length - 1;

  while (true) {
    const pivotIndex = low + Math.floor(Math.random() * (high - low + 1));
    [array[pivotIndex], array[high]] = [array[high]!, array[pivotIndex]!];

    const position = lomutoPartition(array, low, high, compare);
    if (position === k) return array[position]!;
    if (position < k) low = position + 1;
    else high = position - 1;
  }
};

export const median = (values: readonly number[]): number => {
  if (values.length === 0) throw new RangeError('Median of an empty array is undefined');
  const middle = values.length >> 1;
  if (values.length % 2 === 1) return quickSelect(values, middle);
  return (quickSelect(values, middle - 1) + quickSelect(values, middle)) / 2;
};
