def n_queens(n):
    solutions, columns = [], []
    used_columns, diagonals, anti_diagonals = set(), set(), set()

    def place(row):
        if row == n:
            solutions.append(['.' * col + 'Q' + '.' * (n - col - 1) for col in columns])
            return
        for col in range(n):
            if col in used_columns or row - col in diagonals or row + col in anti_diagonals:
                continue
            columns.append(col)
            used_columns.add(col)
            diagonals.add(row - col)
            anti_diagonals.add(row + col)
            place(row + 1)
            columns.pop()
            used_columns.remove(col)
            diagonals.remove(row - col)
            anti_diagonals.remove(row + col)

    place(0)
    return solutions


def count_n_queens(n):
    full = (1 << n) - 1

    def count(columns, diagonals, anti_diagonals):
        if columns == full:
            return 1
        total = 0
        free = full & ~(columns | diagonals | anti_diagonals)
        while free:
            bit = free & -free
            free ^= bit
            total += count(columns | bit, ((diagonals | bit) << 1) & full, (anti_diagonals | bit) >> 1)
        return total

    return count(0, 0, 0)
