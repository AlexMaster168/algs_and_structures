const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

export const toBase = (value: number, base: number): string => {
  if (base < 2 || base > 36) throw new RangeError('Base must be between 2 and 36');
  if (value === 0) return '0';

  const negative = value < 0;
  let rest = Math.abs(value);
  let result = '';
  while (rest > 0) {
    result = DIGITS[rest % base] + result;
    rest = Math.floor(rest / base);
  }
  return negative ? `-${result}` : result;
};

export const fromBase = (input: string, base: number): number => {
  const negative = input.startsWith('-');
  let result = 0;
  for (const char of input.slice(negative ? 1 : 0).toLowerCase()) {
    const digit = DIGITS.indexOf(char);
    if (digit < 0 || digit >= base) throw new RangeError(`Invalid digit "${char}" for base ${base}`);
    result = result * base + digit;
  }
  return negative ? -result : result;
};

const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export const toRoman = (value: number): string => {
  if (!Number.isInteger(value) || value < 1 || value > 3999) throw new RangeError('Value must be in 1..3999');
  let result = '';
  for (const [amount, symbol] of ROMAN) {
    while (value >= amount) {
      result += symbol;
      value -= amount;
    }
  }
  return result;
};

export const fromRoman = (input: string): number => {
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    const current = values[input[i]!]!;
    const next = values[input[i + 1] ?? ''] ?? 0;
    result += current < next ? -current : current;
  }
  return result;
};
