use super::types::AdjacencyList;
pub fn eulerian_path_directed(graph: &AdjacencyList) -> Option<Vec<usize>> {
    let n = graph.len();
    let mut degree = vec![0usize; n];
    let mut edges = 0;
    for neighbors in graph {
        for &neighbor in neighbors {
            degree[neighbor] += 1;
        }
        edges += neighbors.len();
    }
    if edges == 0 {
        return Some(if n > 0 { vec![0] } else { Vec::new() });
    }
    let mut start = graph.iter().position(|row| !row.is_empty()).unwrap();
    let (mut starts, mut ends) = (0, 0);
    for vertex in 0..n {
        match graph[vertex].len() as isize - degree[vertex] as isize {
            1 => {
                starts += 1;
                start = vertex;
            }
            -1 => ends += 1,
            0 => {}
            _ => return None,
        }
    }
    if !((starts == 0 && ends == 0) || (starts == 1 && ends == 1)) {
        return None;
    }
    let mut next = vec![0; n];
    let mut stack = vec![start];
    let mut path = Vec::new();
    while let Some(&vertex) = stack.last() {
        if next[vertex] < graph[vertex].len() {
            stack.push(graph[vertex][next[vertex]]);
            next[vertex] += 1;
        } else {
            path.push(stack.pop().unwrap());
        }
    }
    if path.len() == edges + 1 {
        path.reverse();
        Some(path)
    } else {
        None
    }
}
