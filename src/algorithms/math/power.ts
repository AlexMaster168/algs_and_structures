export const fastPower = (base: number, exponent: number): number => {
  if (exponent < 0) return 1 / fastPower(base, -exponent);
  let result = 1;
  while (exponent > 0) {
    if (exponent & 1) result *= base;
    base *= base;
    exponent = Math.floor(exponent / 2);
  }
  return result;
};

export const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base %= modulus;
  if (base < 0n) base += modulus;
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exponent >>= 1n;
  }
  return result;
};

export const integerSqrt = (n: number): number => {
  if (n < 0) throw new RangeError('Square root of a negative number');
  if (n < 2) return n;
  let x = n;
  let y = Math.floor((x + 1) / 2);
  while (y < x) {
    x = y;
    y = Math.floor((x + Math.floor(n / x)) / 2);
  }
  return x;
};

export const newtonSqrt = (n: number, epsilon = 1e-12): number => {
  if (n < 0) throw new RangeError('Square root of a negative number');
  if (n === 0) return 0;
  let x = n;
  while (Math.abs(x * x - n) > epsilon * n) x = (x + n / x) / 2;
  return x;
};
