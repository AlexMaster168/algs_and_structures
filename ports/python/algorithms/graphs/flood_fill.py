def flood_fill(image, row, col, color):
    result = [list(line) for line in image]
    if row < 0 or row >= len(result) or col < 0 or col >= len(result[row]):
        return result
    original = result[row][col]
    if original == color:
        return result
    stack = [(row, col)]
    while stack:
        r, c = stack.pop()
        if r < 0 or r >= len(result) or c < 0 or c >= len(result[r]) or result[r][c] != original:
            continue
        result[r][c] = color
        stack.extend(((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)))
    return result
