import { mulberry32 } from '../algorithms/randomized/shuffle.js';
export const randomInts = (count, min, max, seed = 42) => {
    const random = mulberry32(seed);
    return Array.from({ length: count }, () => min + Math.floor(random() * (max - min + 1)));
};
export const numericSort = (values) => [...values].sort((a, b) => a - b);
