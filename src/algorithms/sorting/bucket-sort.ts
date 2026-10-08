import { insertionSort } from './insertion-sort.js';

export const bucketSort = (input: readonly number[], bucketCount = Math.max(1, Math.round(Math.sqrt(input.length)))): number[] => {
  if (input.length <= 1) return [...input];

  let min = input[0]!;
  let max = input[0]!;
  for (const value of input) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (min === max) return [...input];

  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  const range = (max - min) / bucketCount;

  for (const value of input) {
    const index = Math.min(bucketCount - 1, Math.floor((value - min) / range));
    buckets[index]!.push(value);
  }

  return buckets.flatMap((bucket) => insertionSort(bucket));
};
