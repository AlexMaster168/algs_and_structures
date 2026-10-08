export const nQueens = (n: number): string[][] => {
  const solutions: string[][] = [];
  const columns: number[] = [];
  const usedColumns = new Set<number>();
  const usedDiagonals = new Set<number>();
  const usedAntiDiagonals = new Set<number>();

  const place = (row: number): void => {
    if (row === n) {
      solutions.push(columns.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (usedColumns.has(col) || usedDiagonals.has(row - col) || usedAntiDiagonals.has(row + col)) continue;

      columns.push(col);
      usedColumns.add(col);
      usedDiagonals.add(row - col);
      usedAntiDiagonals.add(row + col);

      place(row + 1);

      columns.pop();
      usedColumns.delete(col);
      usedDiagonals.delete(row - col);
      usedAntiDiagonals.delete(row + col);
    }
  };

  place(0);
  return solutions;
};

export const countNQueens = (n: number): number => {
  const full = (1 << n) - 1;
  const count = (columns: number, diagonals: number, antiDiagonals: number): number => {
    if (columns === full) return 1;
    let total = 0;
    let free = full & ~(columns | diagonals | antiDiagonals);
    while (free) {
      const bit = free & -free;
      free ^= bit;
      total += count(columns | bit, ((diagonals | bit) << 1) & full, (antiDiagonals | bit) >> 1);
    }
    return total;
  };
  return count(0, 0, 0);
};
