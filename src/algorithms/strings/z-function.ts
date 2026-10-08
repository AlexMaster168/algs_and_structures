export const zFunction = (s: string): number[] => {
  const z = new Array<number>(s.length).fill(0);
  if (s.length > 0) z[0] = s.length;

  for (let i = 1, left = 0, right = 0; i < s.length; i++) {
    if (i < right) z[i] = Math.min(right - i, z[i - left]!);
    while (i + z[i]! < s.length && s[z[i]!] === s[i + z[i]!]) z[i]!++;
    if (i + z[i]! > right) {
      left = i;
      right = i + z[i]!;
    }
  }

  return z;
};

export const zSearch = (text: string, pattern: string): number[] => {
  if (pattern.length === 0) return [];
  const z = zFunction(`${pattern}\u0000${text}`);
  const matches: number[] = [];
  for (let i = pattern.length + 1; i < z.length; i++) {
    if (z[i]! >= pattern.length) matches.push(i - pattern.length - 1);
  }
  return matches;
};
