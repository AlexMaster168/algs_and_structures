export type SudokuBoard = number[][];

export const solveSudoku = (input: readonly (readonly number[])[]): SudokuBoard | null => {
  const board = input.map((row) => [...row]);
  const rows = Array.from({ length: 9 }, () => new Set<number>());
  const cols = Array.from({ length: 9 }, () => new Set<number>());
  const boxes = Array.from({ length: 9 }, () => new Set<number>());
  const empty: [number, number][] = [];
  const box = (r: number, c: number): number => Math.floor(r / 3) * 3 + Math.floor(c / 3);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r]![c]!;
      if (value === 0) {
        empty.push([r, c]);
        continue;
      }
      if (rows[r]!.has(value) || cols[c]!.has(value) || boxes[box(r, c)]!.has(value)) return null;
      rows[r]!.add(value);
      cols[c]!.add(value);
      boxes[box(r, c)]!.add(value);
    }
  }

  const fill = (index: number): boolean => {
    if (index === empty.length) return true;
    const [r, c] = empty[index]!;
    const b = box(r, c);

    for (let value = 1; value <= 9; value++) {
      if (rows[r]!.has(value) || cols[c]!.has(value) || boxes[b]!.has(value)) continue;

      board[r]![c] = value;
      rows[r]!.add(value);
      cols[c]!.add(value);
      boxes[b]!.add(value);

      if (fill(index + 1)) return true;

      board[r]![c] = 0;
      rows[r]!.delete(value);
      cols[c]!.delete(value);
      boxes[b]!.delete(value);
    }

    return false;
  };

  return fill(0) ? board : null;
};
