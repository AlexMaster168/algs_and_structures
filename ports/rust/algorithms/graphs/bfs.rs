use super::types::{reconstruct_path, AdjacencyList};
pub struct BfsResult {
    pub order: Vec<usize>,
    pub distance: Vec<isize>,
    pub parent: Vec<Option<usize>>,
}
pub fn bfs(graph: &AdjacencyList, start: usize) -> BfsResult {
    let mut result = BfsResult {
        order: Vec::new(),
        distance: vec![-1; graph.len()],
        parent: vec![None; graph.len()],
    };
    let mut queue = vec![start];
    result.distance[start] = 0;
    let mut head = 0;
    while head < queue.len() {
        let vertex = queue[head];
        head += 1;
        result.order.push(vertex);
        for &neighbor in &graph[vertex] {
            if result.distance[neighbor] < 0 {
                result.distance[neighbor] = result.distance[vertex] + 1;
                result.parent[neighbor] = Some(vertex);
                queue.push(neighbor);
            }
        }
    }
    result
}
pub fn shortest_path_unweighted(
    graph: &AdjacencyList,
    start: usize,
    target: usize,
) -> Option<Vec<usize>> {
    let result = bfs(graph, start);
    (result.distance[target] >= 0).then(|| reconstruct_path(&result.parent, target))
}
pub fn grid_shortest_path(
    grid: &[String],
    start: (usize, usize),
    target: (usize, usize),
    wall: char,
) -> isize {
    let grid: Vec<Vec<char>> = grid.iter().map(|row| row.chars().collect()).collect();
    if grid.is_empty() {
        return -1;
    }
    let rows = grid.len();
    let cols = grid[0].len();
    let mut distance = vec![vec![-1; cols]; rows];
    let mut queue = vec![start];
    distance[start.0][start.1] = 0;
    let mut head = 0;
    while head < queue.len() {
        let (r, c) = queue[head];
        head += 1;
        if (r, c) == target {
            return distance[r][c];
        }
        for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
            let nr = r as isize + dr;
            let nc = c as isize + dc;
            if nr < 0 || nc < 0 || nr >= rows as isize || nc >= cols as isize {
                continue;
            }
            let (nr, nc) = (nr as usize, nc as usize);
            if grid[nr][nc] != wall && distance[nr][nc] < 0 {
                distance[nr][nc] = distance[r][c] + 1;
                queue.push((nr, nc));
            }
        }
    }
    -1
}
