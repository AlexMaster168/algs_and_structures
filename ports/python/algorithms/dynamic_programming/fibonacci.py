from .memoize import memoize


def fibonacci_recursive(n):
    return n if n < 2 else fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


@memoize
def fibonacci_memo(n):
    return n if n < 2 else fibonacci_memo(n - 1) + fibonacci_memo(n - 2)


def fibonacci(n):
    previous, current = 0, 1
    for _ in range(n):
        previous, current = current, previous + current
    return previous


def fibonacci_fast(n):
    if n < 0:
        raise ValueError('Index must be non-negative')

    def pair(k):
        if k == 0:
            return 0, 1
        a, b = pair(k // 2)
        c = a * (2 * b - a)
        d = a * a + b * b
        return (d, c + d) if k & 1 else (c, d)

    return pair(n)[0]
