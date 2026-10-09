use std::collections::HashMap;
pub fn two_sum_sorted(sorted: &[f64], target: f64) -> Option<(usize, usize)> {
    if sorted.len() < 2 {
        return None;
    }
    let (mut left, mut right) = (0, sorted.len() - 1);
    while left < right {
        let sum = sorted[left] + sorted[right];
        if sum == target {
            return Some((left, right));
        }
        if sum < target {
            left += 1;
        } else {
            right -= 1;
        }
    }
    None
}
fn key(value: f64) -> u64 {
    if value == 0.0 {
        0
    } else {
        value.to_bits()
    }
}
pub fn two_sum(values: &[f64], target: f64) -> Option<(usize, usize)> {
    let mut seen = HashMap::new();
    for (i, &value) in values.iter().enumerate() {
        if let Some(&j) = seen.get(&key(target - value)) {
            return Some((j, i));
        }
        seen.insert(key(value), i);
    }
    None
}
pub fn three_sum(values: &[f64], target: f64) -> Vec<(f64, f64, f64)> {
    let mut sorted = values.to_vec();
    sorted.sort_by(f64::total_cmp);
    let mut result = Vec::new();
    for i in 0..sorted.len().saturating_sub(2) {
        if i > 0 && sorted[i] == sorted[i - 1] {
            continue;
        }
        let (mut left, mut right) = (i + 1, sorted.len() - 1);
        while left < right {
            let sum = sorted[i] + sorted[left] + sorted[right];
            if sum < target {
                left += 1;
            } else if sum > target {
                right -= 1;
            } else {
                result.push((sorted[i], sorted[left], sorted[right]));
                while left < right && sorted[left] == sorted[left + 1] {
                    left += 1;
                }
                while left < right && sorted[right] == sorted[right - 1] {
                    right -= 1;
                }
                left += 1;
                right -= 1;
            }
        }
    }
    result
}
pub fn container_with_most_water(heights: &[f64]) -> f64 {
    if heights.len() < 2 {
        return 0.0;
    }
    let (mut left, mut right) = (0, heights.len() - 1);
    let mut best: f64 = 0.0;
    while left < right {
        best = best.max(heights[left].min(heights[right]) * (right - left) as f64);
        if heights[left] < heights[right] {
            left += 1;
        } else {
            right -= 1;
        }
    }
    best
}
pub fn remove_duplicates_sorted(sorted: &mut Vec<f64>) -> usize {
    let mut write = 0;
    for read in 0..sorted.len() {
        if read == 0 || sorted[read] != sorted[write - 1] {
            sorted[write] = sorted[read];
            write += 1;
        }
    }
    sorted.truncate(write);
    write
}
pub fn dutch_national_flag(values: &mut Vec<f64>, pivot: f64) -> &mut Vec<f64> {
    let (mut low, mut mid, mut high) = (0, 0, values.len());
    while mid < high {
        if values[mid] < pivot {
            values.swap(low, mid);
            low += 1;
            mid += 1;
        } else if values[mid] > pivot {
            high -= 1;
            values.swap(mid, high);
        } else {
            mid += 1;
        }
    }
    values
}
pub fn has_cycle_floyd<T: Clone + PartialEq>(start: T, next: impl Fn(&T) -> Option<T>) -> bool {
    let mut slow = Some(start.clone());
    let mut fast = Some(start);
    while let Some(first) = fast {
        let Some(second) = next(&first) else {
            return false;
        };
        fast = next(&second);
        slow = slow.and_then(|node| next(&node));
        if fast.is_some() && fast == slow {
            return true;
        }
    }
    false
}
