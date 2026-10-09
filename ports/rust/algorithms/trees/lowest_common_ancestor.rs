use crate::algorithms::graphs::types::AdjacencyList;
pub struct LowestCommonAncestor {
    depth: Vec<Option<usize>>,
    up: Vec<Vec<usize>>,
}
impl LowestCommonAncestor {
    pub fn new(tree: &AdjacencyList, root: usize) -> Self {
        assert!(root < tree.len());
        let levels = ((tree.len() + 1) as f64).log2().ceil().max(1.0) as usize;
        let mut depth = vec![None; tree.len()];
        let mut up = vec![vec![root; tree.len()]; levels];
        let mut order = vec![root];
        depth[root] = Some(0);
        let mut head = 0;
        while head < order.len() {
            let vertex = order[head];
            head += 1;
            for &child in &tree[vertex] {
                if depth[child].is_none() {
                    depth[child] = Some(depth[vertex].unwrap() + 1);
                    up[0][child] = vertex;
                    order.push(child);
                }
            }
        }
        for k in 1..levels {
            for v in 0..tree.len() {
                up[k][v] = up[k - 1][up[k - 1][v]];
            }
        }
        Self { depth, up }
    }
    pub fn ancestor(&self, mut vertex: usize, steps: usize) -> usize {
        let mut steps = steps.min(self.depth[vertex].expect("Unreachable vertex"));
        for k in 0..self.up.len() {
            if steps == 0 {
                break;
            }
            if steps & 1 == 1 {
                vertex = self.up[k][vertex];
            }
            steps >>= 1;
        }
        vertex
    }
    pub fn lca(&self, mut a: usize, mut b: usize) -> usize {
        if self.depth[a] < self.depth[b] {
            std::mem::swap(&mut a, &mut b);
        }
        a = self.ancestor(a, self.depth[a].unwrap() - self.depth[b].unwrap());
        if a == b {
            return a;
        }
        for k in (0..self.up.len()).rev() {
            if self.up[k][a] != self.up[k][b] {
                a = self.up[k][a];
                b = self.up[k][b];
            }
        }
        self.up[0][a]
    }
    pub fn distance(&self, a: usize, b: usize) -> usize {
        self.depth[a].unwrap() + self.depth[b].unwrap() - 2 * self.depth[self.lca(a, b)].unwrap()
    }
}
