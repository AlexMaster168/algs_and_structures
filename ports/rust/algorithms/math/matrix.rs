pub type Matrix = Vec<Vec<f64>>;

pub fn identity(size: usize) -> Matrix {
    (0..size)
        .map(|r| (0..size).map(|c| if r == c { 1.0 } else { 0.0 }).collect())
        .collect()
}

pub fn multiply(a: &[Vec<f64>], b: &[Vec<f64>]) -> Matrix {
    if a.is_empty() || b.is_empty() {
        return vec![];
    }
    let columns = b[0].len();
    let inner = b.len();
    assert!(a.iter().all(|r| r.len() == inner) && b.iter().all(|r| r.len() == columns));
    let mut result = vec![vec![0.0; columns]; a.len()];
    for i in 0..a.len() {
        for k in 0..inner {
            for j in 0..columns {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    result
}

pub fn transpose(a: &[Vec<f64>]) -> Matrix {
    if a.is_empty() {
        return vec![];
    }
    assert!(a.iter().all(|r| r.len() == a[0].len()));
    (0..a[0].len())
        .map(|c| a.iter().map(|r| r[c]).collect())
        .collect()
}

pub fn matrix_power(a: &[Vec<f64>], mut exponent: u64) -> Matrix {
    assert!(a.iter().all(|r| r.len() == a.len()));
    let mut result = identity(a.len());
    let mut base = a.to_vec();
    while exponent > 0 {
        if exponent & 1 == 1 {
            result = multiply(&result, &base);
        }
        base = multiply(&base, &base);
        exponent >>= 1;
    }
    result
}

pub fn determinant(a: &[Vec<f64>]) -> f64 {
    let n = a.len();
    assert!(a.iter().all(|r| r.len() == n));
    let mut a = a.to_vec();
    let mut result = 1.0;
    for i in 0..n {
        let pivot = (i..n)
            .max_by(|&r, &s| a[r][i].abs().total_cmp(&a[s][i].abs()))
            .unwrap();
        if a[pivot][i].abs() < 1e-12 {
            return 0.0;
        }
        if pivot != i {
            a.swap(i, pivot);
            result = -result;
        }
        result *= a[i][i];
        for r in i + 1..n {
            let factor = a[r][i] / a[i][i];
            for c in i + 1..n {
                a[r][c] -= factor * a[i][c];
            }
        }
    }
    result
}

pub fn solve_linear_system(a: &[Vec<f64>], b: &[f64]) -> Option<Vec<f64>> {
    let n = a.len();
    assert!(b.len() == n && a.iter().all(|r| r.len() == n));
    let mut m: Matrix = a
        .iter()
        .zip(b)
        .map(|(r, &v)| {
            let mut row = r.clone();
            row.push(v);
            row
        })
        .collect();
    for i in 0..n {
        let pivot = (i..n)
            .max_by(|&r, &s| m[r][i].abs().total_cmp(&m[s][i].abs()))
            .unwrap();
        if m[pivot][i].abs() < 1e-12 {
            return None;
        }
        m.swap(i, pivot);
        let divisor = m[i][i];
        for c in i..=n {
            m[i][c] /= divisor;
        }
        for r in 0..n {
            if r == i {
                continue;
            }
            let factor = m[r][i];
            for c in i..=n {
                m[r][c] -= factor * m[i][c];
            }
        }
    }
    Some(m.into_iter().map(|r| r[n]).collect())
}
