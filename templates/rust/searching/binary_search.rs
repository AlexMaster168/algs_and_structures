pub fn binary_search(values: &[i32], target: i32) -> Option<usize> {
    let (mut left, mut right) = (0, values.len());
    while left < right {
        let middle = left + (right - left) / 2;
        if values[middle] < target { left = middle + 1; } else { right = middle; }
    }
    if left < values.len() && values[left] == target { Some(left) } else { None }
}
