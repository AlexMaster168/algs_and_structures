export const wordSearch = (grid, word) => {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const search = (r, c, index) => {
        if (index === word.length)
            return true;
        if (r < 0 || c < 0 || r >= rows || c >= cols)
            return false;
        if (visited[r][c] || grid[r][c] !== word[index])
            return false;
        visited[r][c] = true;
        const found = search(r + 1, c, index + 1) ||
            search(r - 1, c, index + 1) ||
            search(r, c + 1, index + 1) ||
            search(r, c - 1, index + 1);
        visited[r][c] = false;
        return found;
    };
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++)
            if (search(r, c, 0))
                return true;
    }
    return false;
};
