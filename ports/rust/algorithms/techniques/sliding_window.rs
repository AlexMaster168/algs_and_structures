use std::collections::{HashMap, VecDeque};
pub fn max_sum_window(values: &[f64], size: usize) -> f64 {
    assert!(size > 0 && size <= values.len());
    let mut sum: f64 = values[..size].iter().sum();
    let mut best = sum;
    for i in size..values.len() {
        sum += values[i] - values[i - size];
        best = best.max(sum);
    }
    best
}
pub fn sliding_window_maximum(values: &[f64], size: usize) -> Vec<f64> {
    assert!(size > 0);
    let mut queue: VecDeque<usize> = VecDeque::new();
    let mut result = Vec::new();
    for (i, &value) in values.iter().enumerate() {
        while queue.front().is_some_and(|&index| index + size <= i) {
            queue.pop_front();
        }
        while queue.back().is_some_and(|&index| values[index] <= value) {
            queue.pop_back();
        }
        queue.push_back(i);
        if i + 1 >= size {
            result.push(values[*queue.front().unwrap()]);
        }
    }
    result
}
pub fn longest_unique_substring(text: &str) -> String {
    let units: Vec<_> = text.encode_utf16().collect();
    let mut seen = HashMap::new();
    let (mut start, mut best_start, mut best_length) = (0, 0, 0);
    for (end, &unit) in units.iter().enumerate() {
        if let Some(&previous) = seen.get(&unit) {
            if previous >= start {
                start = previous + 1;
            }
        }
        seen.insert(unit, end);
        if end - start + 1 > best_length {
            best_start = start;
            best_length = end - start + 1;
        }
    }
    String::from_utf16_lossy(&units[best_start..best_start + best_length])
}
pub fn min_window_substring(text: &str, required: &str) -> String {
    if required.is_empty() {
        return String::new();
    }
    let units: Vec<_> = text.encode_utf16().collect();
    let mut need = HashMap::<u16, isize>::new();
    let mut missing = 0;
    for unit in required.encode_utf16() {
        *need.entry(unit).or_default() += 1;
        missing += 1;
    }
    let (mut left, mut best_start, mut best_length) = (0, 0, usize::MAX);
    for (right, &unit) in units.iter().enumerate() {
        let count = need.entry(unit).or_default();
        if *count > 0 {
            missing -= 1;
        }
        *count -= 1;
        while missing == 0 {
            if right - left + 1 < best_length {
                best_length = right - left + 1;
                best_start = left;
            }
            let count = need.get_mut(&units[left]).unwrap();
            *count += 1;
            if *count > 0 {
                missing += 1;
            }
            left += 1;
        }
    }
    if best_length == usize::MAX {
        String::new()
    } else {
        String::from_utf16_lossy(&units[best_start..best_start + best_length])
    }
}
