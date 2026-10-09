use super::types::AdjacencyList;
pub fn dfs(graph: &AdjacencyList, start: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.len()];
    let mut order = Vec::new();
    let mut stack = vec![start];
    while let Some(vertex) = stack.pop() {
        if visited[vertex] {
            continue;
        }
        visited[vertex] = true;
        order.push(vertex);
        for &neighbor in graph[vertex].iter().rev() {
            if !visited[neighbor] {
                stack.push(neighbor);
            }
        }
    }
    order
}
pub fn dfs_recursive(graph: &AdjacencyList, start: usize) -> Vec<usize> {
    fn visit(graph: &AdjacencyList, vertex: usize, visited: &mut [bool], order: &mut Vec<usize>) {
        visited[vertex] = true;
        order.push(vertex);
        for &neighbor in &graph[vertex] {
            if !visited[neighbor] {
                visit(graph, neighbor, visited, order);
            }
        }
    }
    let mut order = Vec::new();
    visit(graph, start, &mut vec![false; graph.len()], &mut order);
    order
}
pub fn has_path(graph: &AdjacencyList, from: usize, to: usize) -> bool {
    dfs(graph, from).contains(&to)
}
