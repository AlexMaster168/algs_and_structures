export const defaultCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
export const reverseCompare = (compare = defaultCompare) => (a, b) => compare(b, a);
