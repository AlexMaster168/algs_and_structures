use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn linear_search<T>(values: &[T], target: &T, compare: Comparator<T>) -> isize {
    values
        .iter()
        .position(|v| compare(v, target) == Ordering::Equal)
        .map(|i| i as isize)
        .unwrap_or(-1)
}

pub fn linear_search_all<T>(values: &[T], predicate: impl Fn(&T, usize) -> bool) -> Vec<usize> {
    values
        .iter()
        .enumerate()
        .filter_map(|(i, v)| if predicate(v, i) { Some(i) } else { None })
        .collect()
}
