use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn merge<T: Clone>(left: &[T], right: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if compare(&left[i], &right[j]) != Ordering::Greater {
            a.push(left[i].clone());
            i += 1;
        } else {
            a.push(right[j].clone());
            j += 1;
        }
    }
    a.extend_from_slice(&left[i..]);
    a.extend_from_slice(&right[j..]);
    a
}

pub fn merge_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    if input.len() < 2 {
        return input.to_vec();
    }
    let m = input.len() / 2;
    merge(
        &merge_sort(&input[..m], compare),
        &merge_sort(&input[m..], compare),
        compare,
    )
}

pub fn bottom_up_merge_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    let mut size = 1;
    while size < a.len() {
        for start in (0..a.len()).step_by(size * 2) {
            let middle = (start + size).min(a.len());
            let end = (start + size * 2).min(a.len());
            let merged = merge(&a[start..middle], &a[middle..end], compare);
            a[start..end].clone_from_slice(&merged);
        }
        size *= 2;
    }
    a
}
