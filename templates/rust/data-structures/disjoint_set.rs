pub struct DisjointSet { parent: Vec<usize>, sizes: Vec<usize> }

impl DisjointSet {
    pub fn new(size: usize) -> Self {
        Self { parent: (0..size).collect(), sizes: vec![1; size] }
    }
    pub fn find(&mut self, mut value: usize) -> usize {
        assert!(value < self.parent.len(), "Invalid index");
        while value != self.parent[value] {
            self.parent[value] = self.parent[self.parent[value]];
            value = self.parent[value];
        }
        value
    }
    pub fn union(&mut self, a: usize, b: usize) -> bool {
        let (mut a, mut b) = (self.find(a), self.find(b));
        if a == b { return false; }
        if self.sizes[a] < self.sizes[b] { std::mem::swap(&mut a, &mut b); }
        self.parent[b] = a;
        self.sizes[a] += self.sizes[b];
        true
    }
}
