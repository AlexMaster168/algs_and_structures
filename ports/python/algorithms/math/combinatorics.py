def factorial(n):
    if not isinstance(n, int) or n < 0:
        raise ValueError('Factorial is defined for non-negative integers')
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def binomial(n, k):
    if k < 0 or k > n:
        return 0
    k = min(k, n - k)
    result = 1
    for i in range(1, k + 1):
        result = result * (n - k + i) // i
    return result


def pascal_triangle(rows):
    triangle = []
    for r in range(rows):
        row = [1]
        for c in range(1, r):
            row.append(triangle[r - 1][c - 1] + triangle[r - 1][c])
        if r > 0:
            row.append(1)
        triangle.append(row)
    return triangle


def catalan(n):
    return binomial(2 * n, n) // (n + 1)


def next_permutation(values):
    i = len(values) - 2
    while i >= 0 and values[i] >= values[i + 1]:
        i -= 1
    if i < 0:
        values.reverse()
        return False
    j = len(values) - 1
    while values[j] <= values[i]:
        j -= 1
    values[i], values[j] = values[j], values[i]
    left, right = i + 1, len(values) - 1
    while left < right:
        values[left], values[right] = values[right], values[left]
        left += 1
        right -= 1
    return True
