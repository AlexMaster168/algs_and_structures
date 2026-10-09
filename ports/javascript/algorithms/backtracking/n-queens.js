export const nQueens = (n) => {
    const solutions = [];
    const columns = [];
    const usedColumns = new Set();
    const usedDiagonals = new Set();
    const usedAntiDiagonals = new Set();
    const place = (row) => {
        if (row === n) {
            solutions.push(columns.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)));
            return;
        }
        for (let col = 0; col < n; col++) {
            if (usedColumns.has(col) || usedDiagonals.has(row - col) || usedAntiDiagonals.has(row + col))
                continue;
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
export const countNQueens = (n) => {
    const full = (1 << n) - 1;
    const count = (columns, diagonals, antiDiagonals) => {
        if (columns === full)
            return 1;
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
