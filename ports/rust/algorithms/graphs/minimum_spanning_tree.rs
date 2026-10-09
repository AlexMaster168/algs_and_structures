use super::types::{Edge, WeightedAdjacencyList};
use crate::data_structures::{graphs::disjoint_set::DisjointSet, heaps::binary_heap::BinaryHeap};
pub struct SpanningTree {
    pub weight: f64,
    pub edges: Vec<Edge>,
}
pub fn kruskal(vertex_count: usize, edges: &[Edge]) -> SpanningTree {
    let mut sets = DisjointSet::new(vertex_count);
    let mut sorted = edges.to_vec();
    sorted.sort_by(|a, b| a.weight.total_cmp(&b.weight));
    let mut result = SpanningTree {
        weight: 0.0,
        edges: Vec::new(),
    };
    for edge in sorted {
        if sets.union(edge.from, edge.to) {
            result.weight += edge.weight;
            result.edges.push(edge);
            if result.edges.len() == vertex_count.saturating_sub(1) {
                break;
            }
        }
    }
    result
}
pub fn prim(graph: &WeightedAdjacencyList, start: usize) -> SpanningTree {
    let mut result = SpanningTree {
        weight: 0.0,
        edges: Vec::new(),
    };
    if graph.is_empty() {
        return result;
    }
    let mut visited = vec![false; graph.len()];
    let mut heap = BinaryHeap::new(|a: &Edge, b| a.weight.total_cmp(&b.weight), []);
    fn visit(
        graph: &WeightedAdjacencyList,
        vertex: usize,
        visited: &mut [bool],
        heap: &mut BinaryHeap<Edge>,
    ) {
        visited[vertex] = true;
        for edge in &graph[vertex] {
            if !visited[edge.to] {
                heap.push(Edge {
                    from: vertex,
                    to: edge.to,
                    weight: edge.weight,
                });
            }
        }
    }
    visit(graph, start, &mut visited, &mut heap);
    while let Some(edge) = heap.pop() {
        if visited[edge.to] {
            continue;
        }
        result.weight += edge.weight;
        result.edges.push(edge);
        visit(graph, edge.to, &mut visited, &mut heap);
    }
    result
}
