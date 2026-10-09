pub fn longest_increasing_subsequence(values: &[f64]) -> Vec<f64> {
    let mut tails: Vec<usize> = Vec::new();
    let mut previous = vec![None; values.len()];
    for (i, &value) in values.iter().enumerate() {
        let (mut low, mut high) = (0, tails.len());
        while low < high {
            let mid = (low + high) / 2;
            if values[tails[mid]] < value {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        if low > 0 {
            previous[i] = Some(tails[low - 1]);
        }
        if low == tails.len() {
            tails.push(i);
        } else {
            tails[low] = i;
        }
    }
    let mut result = Vec::new();
    let mut current = tails.last().copied();
    while let Some(i) = current {
        result.push(values[i]);
        current = previous[i];
    }
    result.reverse();
    result
}
