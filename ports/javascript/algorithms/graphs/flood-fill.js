export const floodFill = (image, row, col, color) => {
    const result = image.map((line) => [...line]);
    const original = result[row]?.[col];
    if (original === undefined || original === color)
        return result;
    const stack = [[row, col]];
    while (stack.length) {
        const [r, c] = stack.pop();
        if (result[r]?.[c] !== original)
            continue;
        result[r][c] = color;
        stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
    return result;
};
