use super::types::{reconstruct_path, WeightedAdjacencyList};
use crate::data_structures::heaps::binary_heap::BinaryHeap;
pub struct ShortestPaths {
    pub distance: Vec<f64>,
    pub parent: Vec<Option<usize>>,
}
pub fn dijkstra(graph: &WeightedAdjacencyList, source: usize) -> ShortestPaths {
    struct Entry {
        vertex: usize,
        distance: f64,
    }
    let mut result = ShortestPaths {
        distance: vec![f64::INFINITY; graph.len()],
        parent: vec![None; graph.len()],
    };
    result.distance[source] = 0.0;
    let mut heap = BinaryHeap::new(
        |a: &Entry, b| a.distance.total_cmp(&b.distance),
        [Entry {
            vertex: source,
            distance: 0.0,
        }],
    );
    while let Some(entry) = heap.pop() {
        if entry.distance > result.distance[entry.vertex] {
            continue;
        }
        for edge in &graph[entry.vertex] {
            let candidate = entry.distance + edge.weight;
            if candidate < result.distance[edge.to] {
                result.distance[edge.to] = candidate;
                result.parent[edge.to] = Some(entry.vertex);
                heap.push(Entry {
                    vertex: edge.to,
                    distance: candidate,
                });
            }
        }
    }
    result
}
pub fn dijkstra_path(
    graph: &WeightedAdjacencyList,
    source: usize,
    target: usize,
) -> Option<Vec<usize>> {
    let result = dijkstra(graph, source);
    result.distance[target]
        .is_finite()
        .then(|| reconstruct_path(&result.parent, target))
}
