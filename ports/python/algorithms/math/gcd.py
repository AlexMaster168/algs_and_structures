def gcd(a, b):
    a, b = abs(a), abs(b)
    while b != 0:
        a, b = b, a % b
    return a


def lcm(a, b):
    return 0 if a == 0 or b == 0 else abs(a // gcd(a, b) * b)


def extended_gcd(a, b):
    if b == 0:
        return {'gcd': a, 'x': 1, 'y': 0}
    result = extended_gcd(b, a % b)
    return {'gcd': result['gcd'], 'x': result['y'], 'y': result['x'] - a // b * result['y']}


def mod_inverse(a, m):
    result = extended_gcd(a % m, m)
    return result['x'] % m if result['gcd'] == 1 else None
