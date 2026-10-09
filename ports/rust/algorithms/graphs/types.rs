pub type AdjacencyList = Vec<Vec<usize>>;
#[derive(Clone, Copy, Debug)]
pub struct WeightedEdge {
    pub to: usize,
    pub weight: f64,
}
pub type WeightedAdjacencyList = Vec<Vec<WeightedEdge>>;
#[derive(Clone, Copy, Debug)]
pub struct Edge {
    pub from: usize,
    pub to: usize,
    pub weight: f64,
}
pub fn reconstruct_path(parent: &[Option<usize>], target: usize) -> Vec<usize> {
    let mut result = Vec::new();
    let mut current = Some(target);
    while let Some(vertex) = current {
        result.push(vertex);
        current = parent[vertex];
    }
    result.reverse();
    result
}
pub fn to_undirected(vertex_count: usize, edges: &[(usize, usize)]) -> AdjacencyList {
    let mut graph = vec![Vec::new(); vertex_count];
    for &(a, b) in edges {
        graph[a].push(b);
        graph[b].push(a);
    }
    graph
}
pub fn to_weighted_undirected(vertex_count: usize, edges: &[Edge]) -> WeightedAdjacencyList {
    let mut graph = vec![Vec::new(); vertex_count];
    for edge in edges {
        graph[edge.from].push(WeightedEdge {
            to: edge.to,
            weight: edge.weight,
        });
        graph[edge.to].push(WeightedEdge {
            to: edge.from,
            weight: edge.weight,
        });
    }
    graph
}
