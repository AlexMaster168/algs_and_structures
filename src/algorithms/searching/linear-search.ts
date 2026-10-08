export const linearSearch = <T>(array: readonly T[], target: T): number => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) return i;
  }
  return -1;
};

export const linearSearchAll = <T>(array: readonly T[], predicate: (value: T, index: number) => boolean): number[] => {
  const indices: number[] = [];
  array.forEach((value, index) => {
    if (predicate(value, index)) indices.push(index);
  });
  return indices;
};
