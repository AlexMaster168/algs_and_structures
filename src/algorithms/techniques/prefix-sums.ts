export class PrefixSums {
  private readonly prefix: number[];

  constructor(values: readonly number[]) {
    this.prefix = [0];
    for (const value of values) this.prefix.push(this.prefix[this.prefix.length - 1]! + value);
  }

  sum(left: number, right: number): number {
    return this.prefix[right + 1]! - this.prefix[left]!;
  }
}

export class PrefixSums2D {
  private readonly prefix: number[][];

  constructor(matrix: readonly (readonly number[])[]) {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;
    this.prefix = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.prefix[r + 1]![c + 1] = matrix[r]![c]! + this.prefix[r]![c + 1]! + this.prefix[r + 1]![c]! - this.prefix[r]![c]!;
      }
    }
  }

  sum(top: number, left: number, bottom: number, right: number): number {
    const p = this.prefix;
    return p[bottom + 1]![right + 1]! - p[top]![right + 1]! - p[bottom + 1]![left]! + p[top]![left]!;
  }
}

export const subarraySumEquals = (values: readonly number[], target: number): number => {
  const seen = new Map<number, number>([[0, 1]]);
  let sum = 0;
  let count = 0;
  for (const value of values) {
    sum += value;
    count += seen.get(sum - target) ?? 0;
    seen.set(sum, (seen.get(sum) ?? 0) + 1);
  }
  return count;
};

export const differenceArrayApply = (length: number, updates: readonly [left: number, right: number, delta: number][]): number[] => {
  const diff = new Array<number>(length + 1).fill(0);
  for (const [left, right, delta] of updates) {
    diff[left]! += delta;
    diff[right + 1]! -= delta;
  }
  const result: number[] = [];
  let running = 0;
  for (let i = 0; i < length; i++) result.push((running += diff[i]!));
  return result;
};

export const majorityElement = (values: readonly number[]): number | null => {
  let candidate: number | null = null;
  let count = 0;
  for (const value of values) {
    if (count === 0) candidate = value;
    count += value === candidate ? 1 : -1;
  }
  return values.filter((value) => value === candidate).length > values.length / 2 ? candidate : null;
};
