export const getBit = (value: number, position: number): 0 | 1 => ((value >>> position) & 1) as 0 | 1;

export const setBit = (value: number, position: number): number => (value | (1 << position)) >>> 0;

export const clearBit = (value: number, position: number): number => (value & ~(1 << position)) >>> 0;

export const toggleBit = (value: number, position: number): number => (value ^ (1 << position)) >>> 0;

export const countSetBits = (value: number): number => {
  let count = 0;
  for (let v = value >>> 0; v !== 0; v &= v - 1) count++;
  return count;
};

export const isPowerOfTwo = (value: number): boolean => value > 0 && (value & (value - 1)) === 0;

export const lowestSetBit = (value: number): number => value & -value;

export const singleNumber = (values: readonly number[]): number => values.reduce((acc, value) => acc ^ value, 0);

export const reverseBits = (value: number): number => {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (value & 1);
    value >>>= 1;
  }
  return result >>> 0;
};

export const grayCode = (bits: number): number[] => Array.from({ length: 1 << bits }, (_, i) => i ^ (i >> 1));

export const subsetsByMask = <T>(items: readonly T[]): T[][] =>
  Array.from({ length: 1 << items.length }, (_, mask) => items.filter((_, i) => mask & (1 << i)));

export const swapWithoutTemp = (a: number, b: number): [number, number] => {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
};

export const hammingDistance = (a: number, b: number): number => countSetBits(a ^ b);
