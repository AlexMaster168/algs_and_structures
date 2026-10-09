from math import inf


def unique_paths(rows, cols, blocked=()):
    if rows <= 0 or cols <= 0:
        return 0
    ways = [0] * cols
    ways[0] = 1
    for r in range(rows):
        for c in range(cols):
            if r < len(blocked) and c < len(blocked[r]) and blocked[r][c]:
                ways[c] = 0
            elif c > 0:
                ways[c] += ways[c - 1]
    return ways[-1]


def min_path_sum(grid):
    if not grid or not grid[0]:
        return 0
    best = [inf] * len(grid[0])
    best[0] = 0
    for row in grid:
        for c, value in enumerate(row):
            best[c] = value + min(best[c], best[c - 1] if c else inf)
    return best[-1]
