use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn partition3<T: Clone>(
    a: &mut [T],
    low: usize,
    high: usize,
    compare: Comparator<T>,
) -> (usize, usize) {
    let pivot = a[low + (high - low) / 2].clone();
    let (mut left, mut i, mut right) = (low, low, high as isize);
    while (i as isize) <= right {
        match compare(&a[i], &pivot) {
            Ordering::Less => {
                a.swap(i, left);
                left += 1;
                i += 1;
            }
            Ordering::Greater => {
                a.swap(i, right as usize);
                right -= 1;
            }
            Ordering::Equal => {
                i += 1;
            }
        }
    }
    (left, right as usize)
}

pub fn quick_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    if a.len() < 2 {
        return a;
    }
    let mut stack = vec![(0, a.len() - 1)];
    while let Some((low, high)) = stack.pop() {
        if low >= high {
            continue;
        }
        let (left, right) = partition3(&mut a, low, high, compare);
        if left > low {
            stack.push((low, left - 1));
        }
        if right < high {
            stack.push((right + 1, high));
        }
    }
    a
}

pub fn lomuto_partition<T: Clone>(
    a: &mut [T],
    low: usize,
    high: usize,
    compare: Comparator<T>,
) -> usize {
    let pivot = a[high].clone();
    let mut boundary = low;
    for i in low..high {
        if compare(&a[i], &pivot) == Ordering::Less {
            a.swap(i, boundary);
            boundary += 1;
        }
    }
    a.swap(boundary, high);
    boundary
}

pub fn quick_sort_functional<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    if input.len() < 2 {
        return input.to_vec();
    }
    let pivot = &input[0];
    let (mut left, mut right) = (Vec::new(), Vec::new());
    for item in &input[1..] {
        if compare(item, pivot) == Ordering::Less {
            left.push(item.clone());
        } else {
            right.push(item.clone());
        }
    }
    let mut result = quick_sort_functional(&left, compare);
    result.push(pivot.clone());
    result.extend(quick_sort_functional(&right, compare));
    result
}
