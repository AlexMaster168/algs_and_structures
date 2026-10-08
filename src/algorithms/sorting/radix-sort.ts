const sortNonNegative = (input: readonly number[], base: number): number[] => {
  let array = [...input];
  const max = array.reduce((acc, value) => (value > acc ? value : acc), 0);

  for (let exponent = 1; Math.floor(max / exponent) > 0; exponent *= base) {
    const buckets: number[][] = Array.from({ length: base }, () => []);
    for (const value of array) buckets[Math.floor(value / exponent) % base]!.push(value);
    array = buckets.flat();
  }

  return array;
};

export const radixSort = (input: readonly number[], base = 10): number[] => {
  if (input.some((value) => !Number.isInteger(value))) throw new TypeError('Radix sort works only with integers');

  const negatives = input.filter((value) => value < 0).map((value) => -value);
  const positives = input.filter((value) => value >= 0);

  return [
    ...sortNonNegative(negatives, base)
      .reverse()
      .map((value) => -value),
    ...sortNonNegative(positives, base),
  ];
};
