export const prefixFunction = (pattern: string): number[] => {
  const pi = new Array<number>(pattern.length).fill(0);
  for (let i = 1; i < pattern.length; i++) {
    let k = pi[i - 1]!;
    while (k > 0 && pattern[i] !== pattern[k]) k = pi[k - 1]!;
    if (pattern[i] === pattern[k]) k++;
    pi[i] = k;
  }
  return pi;
};

export const kmpSearch = (text: string, pattern: string): number[] => {
  if (pattern.length === 0) return [];

  const pi = prefixFunction(pattern);
  const matches: number[] = [];
  let k = 0;

  for (let i = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pattern[k]) k = pi[k - 1]!;
    if (text[i] === pattern[k]) k++;
    if (k === pattern.length) {
      matches.push(i - k + 1);
      k = pi[k - 1]!;
    }
  }

  return matches;
};
