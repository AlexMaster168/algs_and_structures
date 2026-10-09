use num_bigint::BigInt;
use num_traits::{One, Zero};
use std::collections::HashMap;

pub fn fibonacci_recursive(n: usize) -> u64 {
    if n < 2 {
        n as u64
    } else {
        fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
    }
}

pub fn fibonacci_memo(n: usize) -> u64 {
    fn visit(n: usize, cache: &mut HashMap<usize, u64>) -> u64 {
        if n < 2 {
            return n as u64;
        }
        if let Some(&v) = cache.get(&n) {
            return v;
        }
        let value = visit(n - 1, cache) + visit(n - 2, cache);
        cache.insert(n, value);
        value
    }
    visit(n, &mut HashMap::new())
}

pub fn fibonacci(n: usize) -> BigInt {
    let (mut a, mut b) = (BigInt::zero(), BigInt::one());
    for _ in 0..n {
        let next = &a + &b;
        a = b;
        b = next;
    }
    a
}

pub fn fibonacci_fast(n: usize) -> BigInt {
    fn pair(n: usize) -> (BigInt, BigInt) {
        if n == 0 {
            return (BigInt::zero(), BigInt::one());
        }
        let (a, b) = pair(n / 2);
        let c = &a * (&b * 2 - &a);
        let d = &a * &a + &b * &b;
        if n % 2 == 0 {
            (c, d)
        } else {
            let next = &c + &d;
            (d, next)
        }
    }
    pair(n).0
}
