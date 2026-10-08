export const suffixArray = (s: string): number[] => {
  const n = s.length;
  let rank = Array.from(s, (char) => char.charCodeAt(0));
  let suffixes = Array.from({ length: n }, (_, i) => i);

  for (let k = 1; ; k *= 2) {
    const key = (i: number): [number, number] => [rank[i]!, i + k < n ? rank[i + k]! : -1];
    suffixes.sort((a, b) => {
      const [a1, a2] = key(a);
      const [b1, b2] = key(b);
      return a1 - b1 || a2 - b2;
    });

    const next = new Array<number>(n).fill(0);
    for (let i = 1; i < n; i++) {
      const [p1, p2] = key(suffixes[i - 1]!);
      const [c1, c2] = key(suffixes[i]!);
      next[suffixes[i]!] = next[suffixes[i - 1]!]! + (p1 !== c1 || p2 !== c2 ? 1 : 0);
    }

    rank = next;
    if (n === 0 || rank[suffixes[n - 1]!] === n - 1) break;
  }

  return suffixes;
};

export const lcpArray = (s: string, suffixes: readonly number[]): number[] => {
  const n = s.length;
  const rank = new Array<number>(n);
  suffixes.forEach((suffix, i) => (rank[suffix] = i));

  const lcp = new Array<number>(Math.max(0, n - 1)).fill(0);
  let h = 0;

  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) {
      h = 0;
      continue;
    }
    const j = suffixes[rank[i]! - 1]!;
    while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
    lcp[rank[i]! - 1] = h;
    if (h > 0) h--;
  }

  return lcp;
};

export const countDistinctSubstrings = (s: string): number => {
  const n = s.length;
  const lcp = lcpArray(s, suffixArray(s));
  return (n * (n + 1)) / 2 - lcp.reduce((a, b) => a + b, 0);
};
