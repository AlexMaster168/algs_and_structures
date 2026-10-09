pub fn interpolation_search(a: &[i64], target: i64) -> isize {
    if a.is_empty() {
        return -1;
    }
    let (mut low, mut high) = (0, a.len() - 1);
    while low <= high && a[low] <= target && target <= a[high] {
        if a[low] == a[high] {
            return if a[low] == target { low as isize } else { -1 };
        }
        let pos = low
            + (((target as i128 - a[low] as i128) * (high - low) as i128)
                / (a[high] as i128 - a[low] as i128)) as usize;
        if a[pos] == target {
            return pos as isize;
        }
        if a[pos] < target {
            low = pos + 1;
        } else {
            if pos == 0 {
                break;
            }
            high = pos - 1;
        }
    }
    -1
}
