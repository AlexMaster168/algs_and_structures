use num_bigint::BigInt;
use num_traits::{One, Zero};

pub fn factorial(n: usize) -> BigInt {
    let mut result = BigInt::one();
    for i in 2..=n {
        result *= i;
    }
    result
}

pub fn binomial(n: usize, k: usize) -> BigInt {
    if k > n {
        return BigInt::zero();
    }
    let k = k.min(n - k);
    let mut result = BigInt::one();
    for i in 1..=k {
        result = result * (n - k + i) / i;
    }
    result
}

pub fn catalan(n: usize) -> BigInt {
    binomial(2 * n, n) / (n + 1)
}

pub fn pascal_triangle(rows: usize) -> Vec<Vec<u64>> {
    let mut result: Vec<Vec<u64>> = Vec::new();
    for r in 0..rows {
        let mut row = vec![1; r + 1];
        for c in 1..r {
            row[c] = result[r - 1][c - 1] + result[r - 1][c];
        }
        result.push(row);
    }
    result
}

pub fn next_permutation<T: Ord>(values: &mut [T]) -> bool {
    if values.len() < 2 {
        values.reverse();
        return false;
    }
    let mut i = values.len() - 2;
    while values[i] >= values[i + 1] {
        if i == 0 {
            values.reverse();
            return false;
        }
        i -= 1;
    }
    let mut j = values.len() - 1;
    while values[j] <= values[i] {
        j -= 1;
    }
    values.swap(i, j);
    values[i + 1..].reverse();
    true
}
