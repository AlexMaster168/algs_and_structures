pub fn subset_sum(values: &[usize], target: usize) -> Option<Vec<usize>> {
    let mut reached = vec![None; target + 1];
    let mut reachable = vec![false; target + 1];
    reachable[0] = true;
    for (index, &value) in values.iter().enumerate() {
        if value > target {
            continue;
        }
        for sum in (value..=target).rev() {
            if !reachable[sum] && reachable[sum - value] {
                reachable[sum] = true;
                reached[sum] = Some(index);
            }
        }
    }
    if !reachable[target] {
        return None;
    }
    let mut chosen = Vec::new();
    let mut sum = target;
    while sum > 0 {
        let value = values[reached[sum].unwrap()];
        chosen.push(value);
        sum -= value;
    }
    chosen.reverse();
    Some(chosen)
}

pub fn can_partition(values: &[usize]) -> bool {
    let total: usize = values.iter().sum();
    total % 2 == 0 && subset_sum(values, total / 2).is_some()
}
