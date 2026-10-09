pub fn can_reach_end(jumps: &[usize]) -> bool {
    let mut farthest = 0;
    for (i, &jump) in jumps.iter().enumerate() {
        if i > farthest {
            return false;
        }
        farthest = farthest.max(i + jump);
    }
    true
}
pub fn min_jumps(jumps: &[usize]) -> isize {
    let (mut count, mut end, mut farthest) = (0, 0, 0);
    for (i, &jump) in jumps.iter().enumerate().take(jumps.len().saturating_sub(1)) {
        farthest = farthest.max(i + jump);
        if i == end {
            if farthest <= i {
                return -1;
            }
            count += 1;
            end = farthest;
        }
    }
    count
}
pub fn greedy_change(mut amount: i64, denominations: &[i64]) -> Vec<i64> {
    let mut sorted = denominations.to_vec();
    sorted.sort_unstable_by(|a, b| b.cmp(a));
    let mut result = Vec::new();
    for coin in sorted {
        assert!(coin > 0);
        while amount >= coin {
            result.push(coin);
            amount -= coin;
        }
    }
    result
}
