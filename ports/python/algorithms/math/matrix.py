Matrix = list[list[float]]


def identity(size):
    return [[int(i == j) for j in range(size)] for i in range(size)]


def multiply(a, b):
    rows, inner, cols = len(a), len(b), len(b[0]) if b else 0
    if (len(a[0]) if a else 0) != inner:
        raise ValueError('Columns of A must match rows of B')
    result = [[0] * cols for _ in range(rows)]
    for i in range(rows):
        for k in range(inner):
            if a[i][k] == 0:
                continue
            for j in range(cols):
                result[i][j] += a[i][k] * b[k][j]
    return result


def transpose(matrix):
    return [[row[j] for row in matrix] for j in range(len(matrix[0]) if matrix else 0)]


def matrix_power(matrix, exponent):
    result, base = identity(len(matrix)), [list(row) for row in matrix]
    while exponent > 0:
        if exponent & 1:
            result = multiply(result, base)
        base = multiply(base, base)
        exponent //= 2
    return result


def determinant(matrix):
    n, m, det = len(matrix), [list(row) for row in matrix], 1
    for col in range(n):
        pivot = max(range(col, n), key=lambda row: abs(m[row][col]))
        if abs(m[pivot][col]) < 1e-12:
            return 0
        if pivot != col:
            m[pivot], m[col] = m[col], m[pivot]
            det = -det
        det *= m[col][col]
        for row in range(col + 1, n):
            factor = m[row][col] / m[col][col]
            for k in range(col, n):
                m[row][k] -= factor * m[col][k]
    return det


def solve_linear_system(a, b):
    n = len(a)
    m = [list(row) + [b[i]] for i, row in enumerate(a)]
    for col in range(n):
        pivot = max(range(col, n), key=lambda row: abs(m[row][col]))
        if abs(m[pivot][col]) < 1e-12:
            return None
        m[pivot], m[col] = m[col], m[pivot]
        for row in range(n):
            if row == col:
                continue
            factor = m[row][col] / m[col][col]
            for k in range(col, n + 1):
                m[row][k] -= factor * m[col][k]
    return [row[n] / row[i] for i, row in enumerate(m)]
