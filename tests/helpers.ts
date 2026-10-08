import { mulberry32 } from '../src/algorithms/randomized/shuffle.js';

export const randomInts = (count: number, min: number, max: number, seed = 42): number[] => {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => min + Math.floor(random() * (max - min + 1)));
};

export const numericSort = (values: readonly number[]): number[] => [...values].sort((a, b) => a - b);
