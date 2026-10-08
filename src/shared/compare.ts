export type Comparator<T> = (a: T, b: T) => number;

export const defaultCompare = <T>(a: T, b: T): number => (a < b ? -1 : a > b ? 1 : 0);

export const reverseCompare =
  <T>(compare: Comparator<T> = defaultCompare): Comparator<T> =>
  (a, b) =>
    compare(b, a);
