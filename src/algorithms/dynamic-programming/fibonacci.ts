import { memoize } from './memoize.js';

export const fibonacciRecursive = (n: number): number => (n < 2 ? n : fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2));

export const fibonacciMemo: (n: number) => number = memoize((n: number): number =>
  n < 2 ? n : fibonacciMemo(n - 1) + fibonacciMemo(n - 2),
);

export const fibonacci = (n: number): bigint => {
  let previous = 0n;
  let current = 1n;
  if (n === 0) return previous;
  for (let i = 1; i < n; i++) [previous, current] = [current, previous + current];
  return current;
};

export const fibonacciFast = (n: number): bigint => {
  const pair = (k: number): [bigint, bigint] => {
    if (k === 0) return [0n, 1n];
    const [a, b] = pair(k >> 1);
    const c = a * (2n * b - a);
    const d = a * a + b * b;
    return k & 1 ? [d, c + d] : [c, d];
  };
  return pair(n)[0];
};
