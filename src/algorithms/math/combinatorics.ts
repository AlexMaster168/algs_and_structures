export const factorial = (n: number): bigint => {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('Factorial is defined for non-negative integers');
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result;
};

export const binomial = (n: number, k: number): bigint => {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= k; i++) result = (result * BigInt(n - k + i)) / BigInt(i);
  return result;
};

export const pascalTriangle = (rows: number): number[][] => {
  const triangle: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row = [1];
    for (let c = 1; c < r; c++) row.push(triangle[r - 1]![c - 1]! + triangle[r - 1]![c]!);
    if (r > 0) row.push(1);
    triangle.push(row);
  }
  return triangle;
};

export const catalan = (n: number): bigint => binomial(2 * n, n) / BigInt(n + 1);

export const nextPermutation = (values: number[]): boolean => {
  let i = values.length - 2;
  while (i >= 0 && values[i]! >= values[i + 1]!) i--;
  if (i < 0) {
    values.reverse();
    return false;
  }

  let j = values.length - 1;
  while (values[j]! <= values[i]!) j--;
  [values[i], values[j]] = [values[j]!, values[i]!];

  for (let left = i + 1, right = values.length - 1; left < right; left++, right--) {
    [values[left], values[right]] = [values[right]!, values[left]!];
  }
  return true;
};
