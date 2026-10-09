pub fn unique_paths(rows: usize, cols: usize, blocked: &[Vec<bool>]) -> u64 {
    if rows == 0 || cols == 0 {
        return 0;
    }
    let mut ways = vec![0; cols];
    ways[0] = 1;
    for r in 0..rows {
        for c in 0..cols {
            if blocked
                .get(r)
                .and_then(|row| row.get(c))
                .copied()
                .unwrap_or(false)
            {
                ways[c] = 0;
            } else if c > 0 {
                ways[c] += ways[c - 1];
            }
        }
    }
    ways[cols - 1]
}

pub fn min_path_sum(grid: &[Vec<f64>]) -> f64 {
    if grid.is_empty() || grid[0].is_empty() {
        return 0.0;
    }
    let cols = grid[0].len();
    assert!(grid.iter().all(|row| row.len() == cols));
    let mut best = vec![f64::INFINITY; cols];
    best[0] = 0.0;
    for row in grid {
        for c in 0..cols {
            best[c] = best[c].min(if c > 0 { best[c - 1] } else { f64::INFINITY }) + row[c];
        }
    }
    best[cols - 1]
}
