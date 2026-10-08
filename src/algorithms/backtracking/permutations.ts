export const permutations = <T>(items: readonly T[]): T[][] => {
  const result: T[][] = [];
  const current: T[] = [];
  const used = new Array<boolean>(items.length).fill(false);

  const build = (): void => {
    if (current.length === items.length) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(items[i]!);
      build();
      current.pop();
      used[i] = false;
    }
  };

  build();
  return result;
};

export const combinations = <T>(items: readonly T[], size: number): T[][] => {
  const result: T[][] = [];
  const current: T[] = [];

  const build = (start: number): void => {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let i = start; i <= items.length - (size - current.length); i++) {
      current.push(items[i]!);
      build(i + 1);
      current.pop();
    }
  };

  build(0);
  return result;
};

export const subsets = <T>(items: readonly T[]): T[][] => {
  const result: T[][] = [];
  const current: T[] = [];

  const build = (index: number): void => {
    if (index === items.length) {
      result.push([...current]);
      return;
    }
    build(index + 1);
    current.push(items[index]!);
    build(index + 1);
    current.pop();
  };

  build(0);
  return result;
};

export const combinationSum = (candidates: readonly number[], target: number): number[][] => {
  const sorted = [...new Set(candidates)].sort((a, b) => a - b);
  const result: number[][] = [];
  const current: number[] = [];

  const build = (start: number, remaining: number): void => {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < sorted.length && sorted[i]! <= remaining; i++) {
      current.push(sorted[i]!);
      build(i, remaining - sorted[i]!);
      current.pop();
    }
  };

  build(0, target);
  return result;
};
