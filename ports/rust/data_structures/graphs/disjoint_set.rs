pub struct DisjointSet {
    parent: Vec<usize>,
    sizes: Vec<usize>,
    sets: usize,
}
impl DisjointSet {
    pub fn new(size: usize) -> Self {
        Self {
            parent: (0..size).collect(),
            sizes: vec![1; size],
            sets: size,
        }
    }
    pub fn count(&self) -> usize {
        self.sets
    }
    pub fn find(&mut self, mut x: usize) -> usize {
        let mut root = x;
        while self.parent[root] != root {
            root = self.parent[root];
        }
        while self.parent[x] != root {
            let next = self.parent[x];
            self.parent[x] = root;
            x = next;
        }
        root
    }
    pub fn union(&mut self, a: usize, b: usize) -> bool {
        let mut a = self.find(a);
        let mut b = self.find(b);
        if a == b {
            return false;
        }
        if self.sizes[a] < self.sizes[b] {
            std::mem::swap(&mut a, &mut b);
        }
        self.parent[b] = a;
        self.sizes[a] += self.sizes[b];
        self.sets -= 1;
        true
    }
    pub fn connected(&mut self, a: usize, b: usize) -> bool {
        self.find(a) == self.find(b)
    }
    pub fn size_of(&mut self, x: usize) -> usize {
        let root = self.find(x);
        self.sizes[root]
    }
}
