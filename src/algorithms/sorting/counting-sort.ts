export const countingSort = (input: readonly number[]): number[] => {
  if (input.length === 0) return [];

  let min = input[0]!;
  let max = input[0]!;
  for (const value of input) {
    if (!Number.isInteger(value)) throw new TypeError('Counting sort works only with integers');
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const counts = new Array<number>(max - min + 1).fill(0);
  for (const value of input) counts[value - min]!++;

  for (let i = 1; i < counts.length; i++) counts[i]! += counts[i - 1]!;

  const output = new Array<number>(input.length);
  for (let i = input.length - 1; i >= 0; i--) {
    const value = input[i]!;
    output[--counts[value - min]!] = value;
  }

  return output;
};
