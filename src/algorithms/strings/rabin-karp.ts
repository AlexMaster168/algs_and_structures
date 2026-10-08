const BASE = 256;
const MOD = 1_000_000_007;

export const rabinKarp = (text: string, pattern: string): number[] => {
  const m = pattern.length;
  if (m === 0 || m > text.length) return [];

  let highestPower = 1;
  for (let i = 1; i < m; i++) highestPower = (highestPower * BASE) % MOD;

  let patternHash = 0;
  let windowHash = 0;
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + pattern.charCodeAt(i)) % MOD;
    windowHash = (windowHash * BASE + text.charCodeAt(i)) % MOD;
  }

  const matches: number[] = [];
  for (let start = 0; ; start++) {
    if (windowHash === patternHash && text.startsWith(pattern, start)) matches.push(start);
    if (start + m >= text.length) break;

    windowHash = (windowHash - ((text.charCodeAt(start) * highestPower) % MOD) + MOD) % MOD;
    windowHash = (windowHash * BASE + text.charCodeAt(start + m)) % MOD;
  }

  return matches;
};
