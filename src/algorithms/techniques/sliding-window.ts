import { Deque } from '../../data-structures/linear/deque.js';

export const maxSumWindow = (values: readonly number[], size: number): number => {
  if (size <= 0 || size > values.length) throw new RangeError('Invalid window size');
  let sum = 0;
  for (let i = 0; i < size; i++) sum += values[i]!;
  let best = sum;
  for (let i = size; i < values.length; i++) {
    sum += values[i]! - values[i - size]!;
    best = Math.max(best, sum);
  }
  return best;
};

export const slidingWindowMaximum = (values: readonly number[], size: number): number[] => {
  const window = new Deque<number>();
  const result: number[] = [];

  values.forEach((value, i) => {
    while (!window.isEmpty() && window.peekFront()! <= i - size) window.popFront();
    while (!window.isEmpty() && values[window.peekBack()!]! <= value) window.popBack();
    window.pushBack(i);
    if (i >= size - 1) result.push(values[window.peekFront()!]!);
  });

  return result;
};

export const longestUniqueSubstring = (s: string): string => {
  const lastSeen = new Map<string, number>();
  let start = 0;
  let bestStart = 0;
  let bestLength = 0;

  for (let end = 0; end < s.length; end++) {
    const previous = lastSeen.get(s[end]!);
    if (previous !== undefined && previous >= start) start = previous + 1;
    lastSeen.set(s[end]!, end);
    if (end - start + 1 > bestLength) {
      bestLength = end - start + 1;
      bestStart = start;
    }
  }

  return s.slice(bestStart, bestStart + bestLength);
};

export const minWindowSubstring = (s: string, required: string): string => {
  const need = new Map<string, number>();
  for (const char of required) need.set(char, (need.get(char) ?? 0) + 1);

  let missing = required.length;
  let bestStart = 0;
  let bestLength = Infinity;

  for (let left = 0, right = 0; right < s.length; right++) {
    const char = s[right]!;
    if ((need.get(char) ?? 0) > 0) missing--;
    need.set(char, (need.get(char) ?? 0) - 1);

    while (missing === 0) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }
      const leftChar = s[left++]!;
      need.set(leftChar, need.get(leftChar)! + 1);
      if (need.get(leftChar)! > 0) missing++;
    }
  }

  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
};
