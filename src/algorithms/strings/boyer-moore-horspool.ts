export const boyerMooreHorspool = (text: string, pattern: string): number[] => {
  const m = pattern.length;
  if (m === 0 || m > text.length) return [];

  const shift = new Map<string, number>();
  for (let i = 0; i < m - 1; i++) shift.set(pattern[i]!, m - 1 - i);

  const matches: number[] = [];
  let position = 0;

  while (position <= text.length - m) {
    let j = m - 1;
    while (j >= 0 && text[position + j] === pattern[j]) j--;
    if (j < 0) matches.push(position);
    position += shift.get(text[position + m - 1]!) ?? m;
  }

  return matches;
};
