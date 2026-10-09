use super::{topological_sort::topological_sort_kahn, types::AdjacencyList};
use crate::data_structures::graphs::disjoint_set::DisjointSet;
pub fn has_cycle_directed(graph: &AdjacencyList) -> bool {
    topological_sort_kahn(graph).is_none()
}
pub fn has_cycle_undirected(vertex_count: usize, edges: &[(usize, usize)]) -> bool {
    let mut sets = DisjointSet::new(vertex_count);
    edges.iter().any(|&(a, b)| !sets.union(a, b))
}
