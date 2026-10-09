pub fn matrix_chain_order(dimensions: &[u64]) -> (u64, String) {
    if dimensions.len() < 2 {
        return (0, String::new());
    }
    let n = dimensions.len() - 1;
    let mut cost = vec![vec![0; n]; n];
    let mut split = vec![vec![0; n]; n];
    for length in 2..=n {
        for i in 0..=n - length {
            let j = i + length - 1;
            cost[i][j] = u64::MAX;
            for k in i..j {
                let candidate = cost[i][k]
                    + cost[k + 1][j]
                    + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
                if candidate < cost[i][j] {
                    cost[i][j] = candidate;
                    split[i][j] = k;
                }
            }
        }
    }
    fn render(split: &[Vec<usize>], i: usize, j: usize) -> String {
        if i == j {
            format!("A{}", i + 1)
        } else {
            format!(
                "({}{})",
                render(split, i, split[i][j]),
                render(split, split[i][j] + 1, j)
            )
        }
    }
    (cost[0][n - 1], render(&split, 0, n - 1))
}
