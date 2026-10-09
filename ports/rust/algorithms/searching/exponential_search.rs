use super::binary_search::binary_search;
use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn exponential_search<T>(a: &[T], t: &T, c: Comparator<T>) -> isize {
    if a.is_empty() {
        return -1;
    }
    if c(&a[0], t) == Ordering::Equal {
        return 0;
    }
    let mut bound = 1;
    while bound < a.len() && c(&a[bound], t) == Ordering::Less {
        bound = bound.saturating_mul(2);
    }
    let start = bound / 2;
    let found = binary_search(&a[start..bound.saturating_add(1).min(a.len())], t, c);
    if found < 0 {
        -1
    } else {
        found + start as isize
    }
}
