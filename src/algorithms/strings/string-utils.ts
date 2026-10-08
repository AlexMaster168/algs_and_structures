const BRACKETS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

export const isBalanced = (input: string): boolean => {
  const stack: string[] = [];
  for (const char of input) {
    if (char === '(' || char === '[' || char === '{') stack.push(char);
    else if (char in BRACKETS && stack.pop() !== BRACKETS[char]) return false;
  }
  return stack.length === 0;
};

export const isPalindrome = (input: string): boolean => {
  const normalized = input.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  for (let i = 0, j = normalized.length - 1; i < j; i++, j--) {
    if (normalized[i] !== normalized[j]) return false;
  }
  return true;
};

export const isAnagram = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  const counts = new Map<string, number>();
  for (const char of a) counts.set(char, (counts.get(char) ?? 0) + 1);
  for (const char of b) {
    const count = counts.get(char);
    if (!count) return false;
    counts.set(char, count - 1);
  }
  return true;
};

export const groupAnagrams = (words: readonly string[]): string[][] => {
  const groups = new Map<string, string[]>();
  for (const word of words) {
    const key = [...word].sort().join('');
    groups.set(key, [...(groups.get(key) ?? []), word]);
  }
  return [...groups.values()];
};

export const runLengthEncode = (input: string): string =>
  input.replace(/(.)\1*/gs, (run, char: string) => `${run.length}${char}`);

export const runLengthDecode = (input: string): string =>
  input.replace(/(\d+)(.)/gs, (_, count: string, char: string) => char.repeat(Number(count)));

export const reverseWords = (input: string): string => input.trim().split(/\s+/).reverse().join(' ');
