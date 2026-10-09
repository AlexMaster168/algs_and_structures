pub struct FenwickTree {
    tree: Vec<f64>,
    values: Vec<f64>,
}
impl FenwickTree {
    pub fn new(values: &[f64]) -> Self {
        let mut tree = Vec::with_capacity(values.len() + 1);
        tree.push(0.0);
        tree.extend_from_slice(values);
        for i in 1..tree.len() {
            let parent = i + (i & i.wrapping_neg());
            if parent < tree.len() {
                tree[parent] += tree[i];
            }
        }
        Self {
            tree,
            values: values.to_vec(),
        }
    }
    pub fn with_size(size: usize) -> Self {
        Self::new(&vec![0.0; size])
    }
    pub fn size(&self) -> usize {
        self.values.len()
    }
    pub fn add(&mut self, index: usize, delta: f64) {
        assert!(index < self.size());
        self.values[index] += delta;
        let mut i = index + 1;
        while i < self.tree.len() {
            self.tree[i] += delta;
            i += i & i.wrapping_neg();
        }
    }
    pub fn set(&mut self, index: usize, value: f64) {
        self.add(index, value - self.values[index]);
    }
    pub fn prefix_sum(&self, end: isize) -> f64 {
        if end < 0 {
            return 0.0;
        }
        let mut i = (end as usize + 1).min(self.size());
        let mut sum = 0.0;
        while i > 0 {
            sum += self.tree[i];
            i -= i & i.wrapping_neg();
        }
        sum
    }
    pub fn range_sum(&self, left: usize, right: usize) -> f64 {
        assert!(left <= right);
        self.prefix_sum(right as isize) - self.prefix_sum(left as isize - 1)
    }
    pub fn lower_bound(&self, target: f64) -> usize {
        if target <= 0.0 {
            return 0;
        }
        let mut index = 0;
        let mut sum = 0.0;
        let mut step = 1;
        while step < self.tree.len() {
            step <<= 1;
        }
        while step > 0 {
            let next = index + step;
            if next < self.tree.len() && sum + self.tree[next] < target {
                index = next;
                sum += self.tree[next];
            }
            step >>= 1;
        }
        index.min(self.size())
    }
}
