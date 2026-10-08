export const uniquePaths = (rows: number, cols: number, blocked: readonly (readonly boolean[])[] = []): number => {
  const ways = new Array<number>(cols).fill(0);
  ways[0] = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (blocked[r]?.[c]) ways[c] = 0;
      else if (c > 0) ways[c]! += ways[c - 1]!;
    }
  }

  return ways[cols - 1]!;
};

export const minPathSum = (grid: readonly (readonly number[])[]): number => {
  const cols = grid[0]?.length ?? 0;
  const best = new Array<number>(cols).fill(Infinity);
  best[0] = 0;

  for (const row of grid) {
    for (let c = 0; c < cols; c++) {
      best[c] = row[c]! + Math.min(best[c]!, c > 0 ? best[c - 1]! : Infinity);
    }
  }

  return best[cols - 1]!;
};
