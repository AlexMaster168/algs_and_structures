export const getBit = (value, position) => ((value >>> position) & 1);
export const setBit = (value, position) => (value | (1 << position)) >>> 0;
export const clearBit = (value, position) => (value & ~(1 << position)) >>> 0;
export const toggleBit = (value, position) => (value ^ (1 << position)) >>> 0;
export const countSetBits = (value) => {
    let count = 0;
    for (let v = value >>> 0; v !== 0; v &= v - 1)
        count++;
    return count;
};
export const isPowerOfTwo = (value) => value > 0 && (value & (value - 1)) === 0;
export const lowestSetBit = (value) => value & -value;
export const singleNumber = (values) => values.reduce((acc, value) => acc ^ value, 0);
export const reverseBits = (value) => {
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = (result << 1) | (value & 1);
        value >>>= 1;
    }
    return result >>> 0;
};
export const grayCode = (bits) => Array.from({ length: 1 << bits }, (_, i) => i ^ (i >> 1));
export const subsetsByMask = (items) => Array.from({ length: 1 << items.length }, (_, mask) => items.filter((_, i) => mask & (1 << i)));
export const swapWithoutTemp = (a, b) => {
    a ^= b;
    b ^= a;
    a ^= b;
    return [a, b];
};
export const hammingDistance = (a, b) => countSetBits(a ^ b);
