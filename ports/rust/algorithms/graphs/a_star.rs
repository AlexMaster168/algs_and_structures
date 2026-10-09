use crate::data_structures::heaps::binary_heap::BinaryHeap;
use std::collections::HashMap;
use std::hash::Hash;
pub struct AStarResult<N> {
    pub path: Vec<N>,
    pub cost: f64,
}
pub fn a_star<N: Clone, K: Eq + Hash>(
    start: N,
    goal: N,
    neighbors: impl Fn(&N) -> Vec<(N, f64)>,
    heuristic: impl Fn(&N) -> f64,
    key: impl Fn(&N) -> K,
) -> Option<AStarResult<N>> {
    struct Entry<N> {
        node: N,
        cost: f64,
        estimate: f64,
    }
    let goal_key = key(&goal);
    let mut best = HashMap::new();
    best.insert(key(&start), 0.0);
    let mut came_from: HashMap<K, N> = HashMap::new();
    let estimate = heuristic(&start);
    let mut heap = BinaryHeap::new(
        |a: &Entry<N>, b| a.estimate.total_cmp(&b.estimate),
        [Entry {
            node: start,
            cost: 0.0,
            estimate,
        }],
    );
    while let Some(entry) = heap.pop() {
        let node_key = key(&entry.node);
        if entry.cost > *best.get(&node_key).unwrap() {
            continue;
        }
        if node_key == goal_key {
            let mut path = vec![entry.node];
            while let Some(previous) = came_from.get(&key(path.last().unwrap())) {
                path.push(previous.clone());
            }
            path.reverse();
            return Some(AStarResult {
                path,
                cost: entry.cost,
            });
        }
        for (node, cost) in neighbors(&entry.node) {
            let next_key = key(&node);
            let candidate = entry.cost + cost;
            if candidate < *best.get(&next_key).unwrap_or(&f64::INFINITY) {
                best.insert(next_key, candidate);
                came_from.insert(key(&node), entry.node.clone());
                let estimate = candidate + heuristic(&node);
                heap.push(Entry {
                    node,
                    cost: candidate,
                    estimate,
                });
            }
        }
    }
    None
}
pub type Cell = (usize, usize);
pub fn a_star_grid(grid: &[String], start: Cell, goal: Cell, wall: char) -> Option<Vec<Cell>> {
    let grid: Vec<Vec<char>> = grid.iter().map(|row| row.chars().collect()).collect();
    a_star(
        start,
        goal,
        |(r, c)| {
            [(1, 0), (-1, 0), (0, 1), (0, -1)]
                .into_iter()
                .filter_map(|(dr, dc)| {
                    let row = *r as isize + dr;
                    let col = *c as isize + dc;
                    if row >= 0
                        && col >= 0
                        && grid
                            .get(row as usize)
                            .and_then(|line| line.get(col as usize))
                            .is_some_and(|&value| value != wall)
                    {
                        Some(((row as usize, col as usize), 1.0))
                    } else {
                        None
                    }
                })
                .collect()
        },
        |(r, c)| (r.abs_diff(goal.0) + c.abs_diff(goal.1)) as f64,
        |cell| *cell,
    )
    .map(|result| result.path)
}
