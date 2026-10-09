def word_search(grid, word):
    rows, cols = len(grid), len(grid[0]) if grid else 0
    visited = set()

    def search(r, c, index):
        if index == len(word):
            return True
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return False
        if (r, c) in visited or grid[r][c] != word[index]:
            return False
        visited.add((r, c))
        found = any(search(nr, nc, index + 1) for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)))
        visited.remove((r, c))
        return found

    return any(search(r, c, 0) for r in range(rows) for c in range(cols))
