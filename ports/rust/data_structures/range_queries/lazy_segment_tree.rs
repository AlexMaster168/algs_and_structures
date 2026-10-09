pub struct LazySegmentTree {
    tree: Vec<f64>,
    lazy: Vec<f64>,
    length: usize,
}
impl LazySegmentTree {
    pub fn new(values: &[f64]) -> Self {
        let length = values.len();
        let mut result = Self {
            tree: vec![0.0; 4 * length.max(1)],
            lazy: vec![0.0; 4 * length.max(1)],
            length,
        };
        if length > 0 {
            result.build(1, 0, length - 1, values);
        }
        result
    }
    pub fn size(&self) -> usize {
        self.length
    }
    fn build(&mut self, node: usize, left: usize, right: usize, values: &[f64]) {
        if left == right {
            self.tree[node] = values[left];
            return;
        }
        let mid = (left + right) / 2;
        self.build(node * 2, left, mid, values);
        self.build(node * 2 + 1, mid + 1, right, values);
        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1];
    }
    fn apply(&mut self, node: usize, left: usize, right: usize, delta: f64) {
        self.tree[node] += delta * (right - left + 1) as f64;
        self.lazy[node] += delta;
    }
    fn push(&mut self, node: usize, left: usize, right: usize) {
        if self.lazy[node] != 0.0 && left < right {
            let mid = (left + right) / 2;
            let delta = self.lazy[node];
            self.apply(node * 2, left, mid, delta);
            self.apply(node * 2 + 1, mid + 1, right, delta);
            self.lazy[node] = 0.0;
        }
    }
    fn add(&mut self, node: usize, left: usize, right: usize, from: usize, to: usize, delta: f64) {
        if to < left || right < from {
            return;
        }
        if from <= left && right <= to {
            self.apply(node, left, right, delta);
            return;
        }
        self.push(node, left, right);
        let mid = (left + right) / 2;
        self.add(node * 2, left, mid, from, to, delta);
        self.add(node * 2 + 1, mid + 1, right, from, to, delta);
        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1];
    }
    pub fn range_add(&mut self, left: usize, right: usize, delta: f64) {
        assert!(left <= right && right < self.length);
        self.add(1, 0, self.length - 1, left, right, delta);
    }
    fn sum(&mut self, node: usize, left: usize, right: usize, from: usize, to: usize) -> f64 {
        if to < left || right < from {
            return 0.0;
        }
        if from <= left && right <= to {
            return self.tree[node];
        }
        self.push(node, left, right);
        let mid = (left + right) / 2;
        self.sum(node * 2, left, mid, from, to) + self.sum(node * 2 + 1, mid + 1, right, from, to)
    }
    pub fn range_sum(&mut self, left: usize, right: usize) -> f64 {
        assert!(left <= right && right < self.length);
        self.sum(1, 0, self.length - 1, left, right)
    }
    pub fn set(&mut self, index: usize, value: f64) {
        let old = self.range_sum(index, index);
        self.range_add(index, index, value - old);
    }
}
