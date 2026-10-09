pub struct SparseTable<T> {
    levels: Vec<Vec<T>>,
    length: usize,
    combine: fn(&T, &T) -> T,
}
impl<T: Clone> SparseTable<T> {
    pub fn new(values: &[T], combine: fn(&T, &T) -> T) -> Self {
        let length = values.len();
        let mut levels = vec![values.to_vec()];
        let mut width = 2;
        while width <= length {
            let previous = levels.last().unwrap();
            levels.push(
                (0..=length - width)
                    .map(|i| combine(&previous[i], &previous[i + width / 2]))
                    .collect(),
            );
            width *= 2;
        }
        Self {
            levels,
            length,
            combine,
        }
    }
    pub fn size(&self) -> usize {
        self.length
    }
    pub fn query(&self, left: usize, right: usize) -> T {
        assert!(left <= right && right < self.length);
        let level = (usize::BITS - 1 - (right - left + 1).leading_zeros()) as usize;
        (self.combine)(
            &self.levels[level][left],
            &self.levels[level][right + 1 - (1 << level)],
        )
    }
}
pub fn min_sparse_table(values: &[f64]) -> SparseTable<f64> {
    SparseTable::new(values, |a, b| a.min(*b))
}
pub fn max_sparse_table(values: &[f64]) -> SparseTable<f64> {
    SparseTable::new(values, |a, b| a.max(*b))
}
