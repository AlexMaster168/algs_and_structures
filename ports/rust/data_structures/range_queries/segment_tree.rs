pub struct SegmentTree<T> {
    tree: Vec<T>,
    length: usize,
    identity: T,
    combine: fn(&T, &T) -> T,
}
impl<T: Clone> SegmentTree<T> {
    pub fn new(values: &[T], identity: T, combine: fn(&T, &T) -> T) -> Self {
        let length = values.len();
        let mut tree = vec![identity.clone(); length * 2];
        for (i, value) in values.iter().enumerate() {
            tree[length + i] = value.clone();
        }
        for i in (1..length).rev() {
            tree[i] = combine(&tree[i * 2], &tree[i * 2 + 1]);
        }
        Self {
            tree,
            length,
            identity,
            combine,
        }
    }
    pub fn size(&self) -> usize {
        self.length
    }
    pub fn update(&mut self, index: usize, value: T) {
        assert!(index < self.length);
        let mut i = index + self.length;
        self.tree[i] = value;
        while i > 1 {
            i /= 2;
            self.tree[i] = (self.combine)(&self.tree[i * 2], &self.tree[i * 2 + 1]);
        }
    }
    pub fn query(&self, left: usize, right: usize) -> T {
        assert!(left <= right && right < self.length);
        let mut l = left + self.length;
        let mut r = right + self.length + 1;
        let mut a = self.identity.clone();
        let mut b = self.identity.clone();
        while l < r {
            if l & 1 == 1 {
                a = (self.combine)(&a, &self.tree[l]);
                l += 1;
            }
            if r & 1 == 1 {
                r -= 1;
                b = (self.combine)(&self.tree[r], &b);
            }
            l /= 2;
            r /= 2;
        }
        (self.combine)(&a, &b)
    }
}
pub fn sum_segment_tree(values: &[f64]) -> SegmentTree<f64> {
    SegmentTree::new(values, 0.0, |a, b| a + b)
}
pub fn min_segment_tree(values: &[f64]) -> SegmentTree<f64> {
    SegmentTree::new(values, f64::INFINITY, |a, b| a.min(*b))
}
pub fn max_segment_tree(values: &[f64]) -> SegmentTree<f64> {
    SegmentTree::new(values, f64::NEG_INFINITY, |a, b| a.max(*b))
}
