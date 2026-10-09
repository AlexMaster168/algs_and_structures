use std::collections::HashMap;
pub struct PrefixSums {
    prefix: Vec<f64>,
}
impl PrefixSums {
    pub fn new(values: &[f64]) -> Self {
        let mut prefix = vec![0.0];
        for value in values {
            prefix.push(prefix.last().unwrap() + value);
        }
        Self { prefix }
    }
    pub fn sum(&self, left: usize, right: usize) -> f64 {
        self.prefix[right + 1] - self.prefix[left]
    }
}
pub struct PrefixSums2D {
    prefix: Vec<Vec<f64>>,
}
impl PrefixSums2D {
    pub fn new(matrix: &[Vec<f64>]) -> Self {
        let rows = matrix.len();
        let cols = matrix.first().map_or(0, Vec::len);
        let mut prefix = vec![vec![0.0; cols + 1]; rows + 1];
        for r in 0..rows {
            for c in 0..cols {
                prefix[r + 1][c + 1] =
                    matrix[r][c] + prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c];
            }
        }
        Self { prefix }
    }
    pub fn sum(&self, top: usize, left: usize, bottom: usize, right: usize) -> f64 {
        self.prefix[bottom + 1][right + 1]
            - self.prefix[top][right + 1]
            - self.prefix[bottom + 1][left]
            + self.prefix[top][left]
    }
}
fn key(value: f64) -> u64 {
    if value == 0.0 {
        0
    } else {
        value.to_bits()
    }
}
pub fn subarray_sum_equals(values: &[f64], target: f64) -> usize {
    let mut seen = HashMap::from([(key(0.0), 1)]);
    let mut sum = 0.0;
    let mut count = 0;
    for value in values {
        sum += value;
        count += seen.get(&key(sum - target)).copied().unwrap_or(0);
        *seen.entry(key(sum)).or_insert(0) += 1;
    }
    count
}
pub fn difference_array_apply(length: usize, updates: &[(usize, usize, f64)]) -> Vec<f64> {
    let mut diff = vec![0.0; length + 1];
    for &(left, right, delta) in updates {
        diff[left] += delta;
        diff[right + 1] -= delta;
    }
    let mut running = 0.0;
    diff[..length]
        .iter()
        .map(|value| {
            running += value;
            running
        })
        .collect()
}
pub fn majority_element(values: &[f64]) -> Option<f64> {
    let mut candidate = None;
    let mut count = 0;
    for &value in values {
        if count == 0 {
            candidate = Some(value);
        }
        count += if candidate == Some(value) { 1 } else { -1 };
    }
    if values
        .iter()
        .filter(|&&value| candidate == Some(value))
        .count()
        > values.len() / 2
    {
        candidate
    } else {
        None
    }
}
