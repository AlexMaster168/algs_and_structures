SudokuBoard = list[list[int]]


def solve_sudoku(input):
    if len(input) != 9 or any(len(row) != 9 for row in input):
        raise ValueError('Board must be 9 by 9')
    board = [list(row) for row in input]
    rows, cols, boxes = [set() for _ in range(9)], [set() for _ in range(9)], [set() for _ in range(9)]
    empty = []
    for r in range(9):
        for c in range(9):
            value, b = board[r][c], r // 3 * 3 + c // 3
            if value == 0:
                empty.append((r, c))
                continue
            if value not in range(1, 10) or value in rows[r] or value in cols[c] or value in boxes[b]:
                return None
            rows[r].add(value)
            cols[c].add(value)
            boxes[b].add(value)

    def fill(index):
        if index == len(empty):
            return True
        r, c = empty[index]
        b = r // 3 * 3 + c // 3
        for value in range(1, 10):
            if value in rows[r] or value in cols[c] or value in boxes[b]:
                continue
            board[r][c] = value
            rows[r].add(value)
            cols[c].add(value)
            boxes[b].add(value)
            if fill(index + 1):
                return True
            board[r][c] = 0
            rows[r].remove(value)
            cols[c].remove(value)
            boxes[b].remove(value)
        return False

    return board if fill(0) else None
