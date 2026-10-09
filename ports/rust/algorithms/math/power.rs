use num_bigint::BigInt;
use num_traits::{One, Zero};

pub fn fast_power(mut base: f64, exponent: i64) -> f64 {
    let mut power = exponent.unsigned_abs();
    let mut result = 1.0;
    while power > 0 {
        if power & 1 == 1 {
            result *= base;
        }
        base *= base;
        power /= 2;
    }
    if exponent < 0 {
        1.0 / result
    } else {
        result
    }
}

pub fn mod_pow(base: &BigInt, exponent: &BigInt, modulus: &BigInt) -> BigInt {
    assert!(*modulus > BigInt::zero() && *exponent >= BigInt::zero());
    if *modulus == BigInt::one() {
        return BigInt::zero();
    }
    let mut base = ((base % modulus) + modulus) % modulus;
    let mut power = exponent.clone();
    let mut result = BigInt::one();
    while power > BigInt::zero() {
        if (&power & BigInt::one()) == BigInt::one() {
            result = (result * &base) % modulus;
        }
        base = (&base * &base) % modulus;
        power >>= 1;
    }
    result
}

pub fn integer_sqrt(n: u64) -> u64 {
    if n < 2 {
        return n;
    }
    let mut x = n as u128;
    let mut y = (x + 1) / 2;
    while y < x {
        x = y;
        y = (x + n as u128 / x) / 2;
    }
    x as u64
}

pub fn newton_sqrt(n: f64, epsilon: f64) -> f64 {
    assert!(n >= 0.0 && n.is_finite() && epsilon > 0.0);
    if n == 0.0 {
        return 0.0;
    }
    let mut x = n;
    while (x * x - n).abs() > epsilon * n {
        x = (x + n / x) / 2.0;
    }
    x
}
