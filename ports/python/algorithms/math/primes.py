from .power import mod_pow


def sieve_of_eratosthenes(limit):
    if limit < 2:
        return []
    composite, primes = bytearray(limit + 1), []
    for i in range(2, limit + 1):
        if composite[i]:
            continue
        primes.append(i)
        for j in range(i * i, limit + 1, i):
            composite[j] = 1
    return primes


def linear_sieve(limit):
    smallest_factor, primes = [0] * (limit + 1), []
    for i in range(2, limit + 1):
        if smallest_factor[i] == 0:
            smallest_factor[i] = i
            primes.append(i)
        for p in primes:
            if p > smallest_factor[i] or i * p > limit:
                break
            smallest_factor[i * p] = p
    return {'primes': primes, 'smallest_factor': smallest_factor}


def is_prime(n):
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def miller_rabin(n):
    if n < 2:
        return False
    small_primes = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in small_primes:
        if n == p:
            return True
        if n % p == 0:
            return False
    d, r = n - 1, 0
    while d & 1 == 0:
        d >>= 1
        r += 1
    for a in small_primes:
        x = mod_pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(1, r):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def prime_factors(n):
    factors, p = {}, 2
    while p * p <= n:
        while n % p == 0:
            factors[p] = factors.get(p, 0) + 1
            n //= p
        p += 1
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    return factors


def divisors(n):
    small, large, i = [], [], 1
    while i * i <= n:
        if n % i == 0:
            small.append(i)
            if i != n // i:
                large.append(n // i)
        i += 1
    return small + large[::-1]


def euler_phi(n):
    result = n
    for p in prime_factors(n):
        result -= result // p
    return result
