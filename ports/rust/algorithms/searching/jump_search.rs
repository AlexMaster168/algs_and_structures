use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn jump_search<T>(a: &[T], t: &T, c: Comparator<T>) -> isize {
    if a.is_empty() {
        return -1;
    }
    let step = (a.len() as f64).sqrt().floor() as usize;
    let (mut start, mut end) = (0, step.max(1));
    while c(&a[end.min(a.len()) - 1], t) == Ordering::Less {
        start = end;
        if start >= a.len() {
            return -1;
        }
        end += step.max(1);
    }
    for i in start..end.min(a.len()) {
        if c(&a[i], t) == Ordering::Equal {
            return i as isize;
        }
    }
    -1
}
