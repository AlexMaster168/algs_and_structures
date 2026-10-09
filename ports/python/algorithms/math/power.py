def fast_power(base, exponent):
    if exponent < 0:
        return 1 / fast_power(base, -exponent)
    result = 1
    while exponent > 0:
        if exponent & 1:
            result *= base
        base *= base
        exponent //= 2
    return result


def mod_pow(base, exponent, modulus):
    if modulus == 1:
        return 0
    result = 1
    base %= modulus
    while exponent > 0:
        if exponent & 1:
            result = result * base % modulus
        base = base * base % modulus
        exponent >>= 1
    return result


def integer_sqrt(n):
    if n < 0:
        raise ValueError('Square root of a negative number')
    if n < 2:
        return n
    x, y = n, (n + 1) // 2
    while y < x:
        x = y
        y = (x + n // x) // 2
    return x


def newton_sqrt(n, epsilon=1e-12):
    if n < 0 or epsilon <= 0:
        raise ValueError('Invalid square root arguments')
    if n == 0:
        return 0
    x = n
    while abs(x * x - n) > epsilon * n:
        x = (x + n / x) / 2
    return x
