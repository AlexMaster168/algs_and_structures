pub struct SqrtDecomposition {
    values: Vec<f64>,
    blocks: Vec<f64>,
    width: usize,
}
impl SqrtDecomposition {
    pub fn new(values: &[f64]) -> Self {
        let width = (values.len() as f64).sqrt().ceil().max(1.0) as usize;
        let mut blocks = vec![0.0; values.len().div_ceil(width)];
        for (i, &value) in values.iter().enumerate() {
            blocks[i / width] += value;
        }
        Self {
            values: values.to_vec(),
            blocks,
            width,
        }
    }
    pub fn size(&self) -> usize {
        self.values.len()
    }
    pub fn update(&mut self, index: usize, value: f64) {
        self.blocks[index / self.width] += value - self.values[index];
        self.values[index] = value;
    }
    pub fn range_sum(&self, left: usize, right: usize) -> f64 {
        assert!(left <= right && right < self.values.len());
        let mut i = left;
        let mut sum = 0.0;
        while i <= right {
            if i % self.width == 0 && i + self.width <= right + 1 {
                sum += self.blocks[i / self.width];
                i += self.width;
            } else {
                sum += self.values[i];
                i += 1;
            }
        }
        sum
    }
}
