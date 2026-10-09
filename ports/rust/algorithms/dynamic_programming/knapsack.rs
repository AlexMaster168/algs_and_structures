#[derive(Debug, Clone, Copy)]
pub struct KnapsackItem {
    pub weight: usize,
    pub value: f64,
}

pub fn knapsack01(items: &[KnapsackItem], capacity: usize) -> (f64, Vec<usize>) {
    let n = items.len();
    let mut table = vec![vec![0.0f64; capacity + 1]; n + 1];
    for i in 1..=n {
        let item = items[i - 1];
        for w in 0..=capacity {
            table[i][w] = table[i - 1][w];
            if item.weight <= w {
                table[i][w] = table[i][w].max(table[i - 1][w - item.weight] + item.value);
            }
        }
    }
    let mut chosen = Vec::new();
    let mut w = capacity;
    for i in (1..=n).rev() {
        if table[i][w] != table[i - 1][w] {
            chosen.push(i - 1);
            w -= items[i - 1].weight;
        }
    }
    chosen.reverse();
    (table[n][capacity], chosen)
}

pub fn unbounded_knapsack(items: &[KnapsackItem], capacity: usize) -> f64 {
    let mut best = vec![0.0f64; capacity + 1];
    for w in 1..=capacity {
        for item in items {
            assert!(item.weight > 0);
            if item.weight <= w {
                best[w] = best[w].max(best[w - item.weight] + item.value);
            }
        }
    }
    best[capacity]
}
