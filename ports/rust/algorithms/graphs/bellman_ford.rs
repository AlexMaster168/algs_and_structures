use super::types::Edge;
pub struct BellmanFordResult {
    pub distance: Vec<f64>,
    pub parent: Vec<Option<usize>>,
    pub has_negative_cycle: bool,
}
pub fn bellman_ford(vertex_count: usize, edges: &[Edge], source: usize) -> BellmanFordResult {
    let mut distance = vec![f64::INFINITY; vertex_count];
    let mut parent = vec![None; vertex_count];
    distance[source] = 0.0;
    for _ in 0..vertex_count.saturating_sub(1) {
        let mut changed = false;
        for edge in edges {
            let candidate = distance[edge.from] + edge.weight;
            if candidate < distance[edge.to] {
                distance[edge.to] = candidate;
                parent[edge.to] = Some(edge.from);
                changed = true;
            }
        }
        if !changed {
            break;
        }
    }
    let has_negative_cycle = edges
        .iter()
        .any(|edge| distance[edge.from] + edge.weight < distance[edge.to]);
    BellmanFordResult {
        distance,
        parent,
        has_negative_cycle,
    }
}
