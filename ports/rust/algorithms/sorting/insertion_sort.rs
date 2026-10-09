use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn insertion_sort_range<T: Clone>(
    a: &mut [T],
    left: usize,
    right: usize,
    compare: Comparator<T>,
) {
    if a.is_empty() {
        return;
    }
    assert!(left <= right && right < a.len());
    for i in left + 1..=right {
        let value = a[i].clone();
        let mut j = i;
        while j > left && compare(&a[j - 1], &value) == Ordering::Greater {
            a[j] = a[j - 1].clone();
            j -= 1;
        }
        a[j] = value;
    }
}

pub fn insertion_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    if !a.is_empty() {
        let last = a.len() - 1;
        insertion_sort_range(&mut a, 0, last, compare);
    }
    a
}
