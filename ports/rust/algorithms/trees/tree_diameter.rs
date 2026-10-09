use crate::algorithms::graphs::{
    bfs::bfs,
    types::{reconstruct_path, AdjacencyList},
};
pub struct TreeDiameterResult {
    pub length: isize,
    pub path: Vec<usize>,
}
pub fn tree_diameter(tree: &AdjacencyList) -> TreeDiameterResult {
    if tree.is_empty() {
        return TreeDiameterResult {
            length: 0,
            path: Vec::new(),
        };
    }
    let first = bfs(tree, 0);
    let start = first
        .distance
        .iter()
        .enumerate()
        .max_by_key(|(i, d)| (**d, std::cmp::Reverse(*i)))
        .unwrap()
        .0;
    let second = bfs(tree, start);
    let end = second
        .distance
        .iter()
        .enumerate()
        .max_by_key(|(i, d)| (**d, std::cmp::Reverse(*i)))
        .unwrap()
        .0;
    TreeDiameterResult {
        length: second.distance[end],
        path: reconstruct_path(&second.parent, end),
    }
}
