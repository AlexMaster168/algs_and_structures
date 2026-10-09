export const identity = (size) => Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => (i === j ? 1 : 0)));
export const multiply = (a, b) => {
    const rows = a.length;
    const inner = b.length;
    const cols = b[0]?.length ?? 0;
    if ((a[0]?.length ?? 0) !== inner)
        throw new RangeError('Columns of A must match rows of B');
    const result = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let k = 0; k < inner; k++) {
            const aik = a[i][k];
            if (aik === 0)
                continue;
            for (let j = 0; j < cols; j++)
                result[i][j] += aik * b[k][j];
        }
    }
    return result;
};
export const transpose = (matrix) => (matrix[0] ?? []).map((_, j) => matrix.map((row) => row[j]));
export const matrixPower = (matrix, exponent) => {
    let result = identity(matrix.length);
    let base = matrix.map((row) => [...row]);
    while (exponent > 0) {
        if (exponent & 1)
            result = multiply(result, base);
        base = multiply(base, base);
        exponent = Math.floor(exponent / 2);
    }
    return result;
};
export const determinant = (matrix) => {
    const n = matrix.length;
    const m = matrix.map((row) => [...row]);
    let det = 1;
    for (let col = 0; col < n; col++) {
        let pivot = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(m[row][col]) > Math.abs(m[pivot][col]))
                pivot = row;
        }
        if (Math.abs(m[pivot][col]) < 1e-12)
            return 0;
        if (pivot !== col) {
            [m[pivot], m[col]] = [m[col], m[pivot]];
            det = -det;
        }
        det *= m[col][col];
        for (let row = col + 1; row < n; row++) {
            const factor = m[row][col] / m[col][col];
            for (let k = col; k < n; k++)
                m[row][k] -= factor * m[col][k];
        }
    }
    return det;
};
export const solveLinearSystem = (a, b) => {
    const n = a.length;
    const m = a.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < n; col++) {
        let pivot = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(m[row][col]) > Math.abs(m[pivot][col]))
                pivot = row;
        }
        if (Math.abs(m[pivot][col]) < 1e-12)
            return null;
        [m[pivot], m[col]] = [m[col], m[pivot]];
        for (let row = 0; row < n; row++) {
            if (row === col)
                continue;
            const factor = m[row][col] / m[col][col];
            for (let k = col; k <= n; k++)
                m[row][k] -= factor * m[col][k];
        }
    }
    return m.map((row, i) => row[n] / row[i]);
};
