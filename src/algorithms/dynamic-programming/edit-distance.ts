export const editDistance = (source: string, target: string): number => {
  let previous = Array.from({ length: target.length + 1 }, (_, j) => j);

  for (let i = 1; i <= source.length; i++) {
    const current = [i];
    for (let j = 1; j <= target.length; j++) {
      const substitution = previous[j - 1]! + (source[i - 1] === target[j - 1] ? 0 : 1);
      current[j] = Math.min(previous[j]! + 1, current[j - 1]! + 1, substitution);
    }
    previous = current;
  }

  return previous[target.length]!;
};
