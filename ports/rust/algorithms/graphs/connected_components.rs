use super::types::AdjacencyList;
pub fn connected_components(graph: &AdjacencyList) -> Vec<Vec<usize>> {
    let mut visited = vec![false; graph.len()];
    let mut components = Vec::new();
    for start in 0..graph.len() {
        if visited[start] {
            continue;
        }
        let mut stack = vec![start];
        visited[start] = true;
        let mut component = Vec::new();
        while let Some(vertex) = stack.pop() {
            component.push(vertex);
            for &neighbor in &graph[vertex] {
                if !visited[neighbor] {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                }
            }
        }
        component.sort_unstable();
        components.push(component);
    }
    components
}
