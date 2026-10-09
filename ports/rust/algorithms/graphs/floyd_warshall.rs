pub struct FloydWarshallResult {
    pub distance: Vec<Vec<f64>>,
    pub next: Vec<Vec<Option<usize>>>,
    pub has_negative_cycle: bool,
}
pub fn floyd_warshall(weights: &[Vec<f64>]) -> FloydWarshallResult {
    let n = weights.len();
    let mut distance = weights.to_vec();
    let mut next: Vec<Vec<_>> = weights
        .iter()
        .enumerate()
        .map(|(i, row)| {
            row.iter()
                .enumerate()
                .map(|(j, &weight)| (i == j || weight != f64::INFINITY).then_some(j))
                .collect()
        })
        .collect();
    for (i, row) in distance.iter_mut().enumerate() {
        if row[i] > 0.0 {
            row[i] = 0.0;
        }
    }
    for k in 0..n {
        for i in 0..n {
            if distance[i][k] == f64::INFINITY {
                continue;
            }
            for j in 0..n {
                let candidate = distance[i][k] + distance[k][j];
                if candidate < distance[i][j] {
                    distance[i][j] = candidate;
                    next[i][j] = next[i][k];
                }
            }
        }
    }
    let has_negative_cycle = distance.iter().enumerate().any(|(i, row)| row[i] < 0.0);
    FloydWarshallResult {
        distance,
        next,
        has_negative_cycle,
    }
}
pub fn floyd_warshall_path(
    next: &[Vec<Option<usize>>],
    mut from: usize,
    to: usize,
) -> Option<Vec<usize>> {
    next[from][to]?;
    let mut path = vec![from];
    while from != to {
        from = next[from][to]?;
        path.push(from);
        if path.len() > next.len() + 1 {
            return None;
        }
    }
    Some(path)
}
