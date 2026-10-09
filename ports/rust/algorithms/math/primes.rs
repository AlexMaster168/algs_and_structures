use super::power::mod_pow;
use num_bigint::BigInt;
use num_traits::{One, Zero};
use std::collections::BTreeMap;

pub fn sieve_of_eratosthenes(limit: usize) -> Vec<usize> {
    if limit < 2 {
        return vec![];
    }
    let mut composite = vec![false; limit + 1];
    let mut primes = Vec::new();
    for i in 2..=limit {
        if composite[i] {
            continue;
        }
        primes.push(i);
        if i <= limit / i {
            for j in (i * i..=limit).step_by(i) {
                composite[j] = true;
            }
        }
    }
    primes
}

pub fn linear_sieve(limit: usize) -> (Vec<usize>, Vec<usize>) {
    let mut factors = vec![0; limit + 1];
    let mut primes = Vec::new();
    for i in 2..=limit {
        if factors[i] == 0 {
            factors[i] = i;
            primes.push(i);
        }
        for &p in &primes {
            if p > factors[i] || p > limit / i {
                break;
            }
            factors[i * p] = p;
        }
    }
    (primes, factors)
}

pub fn is_prime(n: i64) -> bool {
    if n < 2 {
        return false;
    }
    if n < 4 {
        return true;
    }
    if n % 2 == 0 || n % 3 == 0 {
        return false;
    }
    let mut i = 5;
    while i <= n / i {
        if n % i == 0 || n % (i + 2) == 0 {
            return false;
        }
        i += 6;
    }
    true
}

pub fn miller_rabin(n: &BigInt) -> bool {
    if *n < BigInt::from(2) {
        return false;
    }
    let bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    for p in bases {
        let p = BigInt::from(p);
        if n == &p {
            return true;
        }
        if n % p == BigInt::zero() {
            return false;
        }
    }
    let minus_one = n - BigInt::one();
    let mut d = minus_one.clone();
    let mut r = 0;
    while (&d & BigInt::one()) == BigInt::zero() {
        d >>= 1;
        r += 1;
    }
    for a in bases {
        let mut x = mod_pow(&BigInt::from(a), &d, n);
        if x == BigInt::one() || x == minus_one {
            continue;
        }
        let mut passed = false;
        for _ in 1..r {
            x = (&x * &x) % n;
            if x == minus_one {
                passed = true;
                break;
            }
        }
        if !passed {
            return false;
        }
    }
    true
}

pub fn prime_factors(mut n: i64) -> BTreeMap<i64, usize> {
    let mut factors = BTreeMap::new();
    let mut p = 2;
    while p <= n / p {
        while n % p == 0 {
            *factors.entry(p).or_insert(0) += 1;
            n /= p;
        }
        p += 1;
    }
    if n > 1 {
        *factors.entry(n).or_insert(0) += 1;
    }
    factors
}

pub fn divisors(n: i64) -> Vec<i64> {
    if n <= 0 {
        return vec![];
    }
    let (mut small, mut large) = (Vec::new(), Vec::new());
    let mut i = 1;
    while i <= n / i {
        if n % i == 0 {
            small.push(i);
            if i != n / i {
                large.push(n / i);
            }
        }
        i += 1;
    }
    small.extend(large.into_iter().rev());
    small
}

pub fn euler_phi(n: i64) -> i64 {
    let mut result = n;
    for p in prime_factors(n).keys() {
        result -= result / p;
    }
    result
}
