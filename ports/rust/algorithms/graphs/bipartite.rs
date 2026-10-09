use super::types::AdjacencyList;
pub fn bipartite_coloring(graph: &AdjacencyList) -> Option<Vec<u8>> {
    let mut color = vec![None; graph.len()];
    for start in 0..graph.len() {
        if color[start].is_some() {
            continue;
        }
        color[start] = Some(0);
        let mut queue = vec![start];
        let mut head = 0;
        while head < queue.len() {
            let vertex = queue[head];
            head += 1;
            for &neighbor in &graph[vertex] {
                if color[neighbor] == color[vertex] {
                    return None;
                }
                if color[neighbor].is_none() {
                    color[neighbor] = Some(1 - color[vertex].unwrap());
                    queue.push(neighbor);
                }
            }
        }
    }
    Some(color.into_iter().map(Option::unwrap).collect())
}
pub fn is_bipartite(graph: &AdjacencyList) -> bool {
    bipartite_coloring(graph).is_some()
}
