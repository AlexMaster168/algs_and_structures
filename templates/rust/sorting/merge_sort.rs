pub fn merge_sort(values: &[i32]) -> Vec<i32> {
    if values.len() < 2 { return values.to_vec(); }
    let middle = values.len() / 2;
    let left = merge_sort(&values[..middle]);
    let right = merge_sort(&values[middle..]);
    let mut result = Vec::with_capacity(values.len());
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] { result.push(left[i]); i += 1; }
        else { result.push(right[j]); j += 1; }
    }
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}
