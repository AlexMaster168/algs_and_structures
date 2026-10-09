use super::types::AdjacencyList;
pub fn topological_sort_kahn(graph: &AdjacencyList) -> Option<Vec<usize>> {
    let mut degree = vec![0; graph.len()];
    for neighbors in graph {
        for &neighbor in neighbors {
            degree[neighbor] += 1;
        }
    }
    let mut queue: Vec<_> = (0..graph.len()).filter(|&i| degree[i] == 0).collect();
    let mut head = 0;
    while head < queue.len() {
        let vertex = queue[head];
        head += 1;
        for &neighbor in &graph[vertex] {
            degree[neighbor] -= 1;
            if degree[neighbor] == 0 {
                queue.push(neighbor);
            }
        }
    }
    (queue.len() == graph.len()).then_some(queue)
}
pub fn topological_sort_dfs(graph: &AdjacencyList) -> Option<Vec<usize>> {
    fn visit(
        graph: &AdjacencyList,
        vertex: usize,
        state: &mut [u8],
        order: &mut Vec<usize>,
    ) -> bool {
        if state[vertex] == 1 {
            return false;
        }
        if state[vertex] == 2 {
            return true;
        }
        state[vertex] = 1;
        for &neighbor in &graph[vertex] {
            if !visit(graph, neighbor, state, order) {
                return false;
            }
        }
        state[vertex] = 2;
        order.push(vertex);
        true
    }
    let mut state = vec![0; graph.len()];
    let mut order = Vec::new();
    for vertex in 0..graph.len() {
        if state[vertex] == 0 && !visit(graph, vertex, &mut state, &mut order) {
            return None;
        }
    }
    order.reverse();
    Some(order)
}
