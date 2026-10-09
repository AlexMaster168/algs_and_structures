use super::insertion_sort::insertion_sort_range;
use super::merge_sort::merge;
use crate::shared::compare::Comparator;

pub fn tim_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    let n = a.len();
    if n < 2 {
        return a;
    }
    let (mut run, mut remainder) = (n, 0);
    while run >= 32 {
        remainder |= run & 1;
        run >>= 1;
    }
    run += remainder;
    for left in (0..n).step_by(run) {
        insertion_sort_range(&mut a, left, (left + run - 1).min(n - 1), compare);
    }
    let mut size = run;
    while size < n {
        for left in (0..n).step_by(2 * size) {
            let middle = (left + size).min(n);
            let right = (left + 2 * size).min(n);
            let combined = merge(&a[left..middle], &a[middle..right], compare);
            a[left..right].clone_from_slice(&combined);
        }
        size *= 2;
    }
    a
}
