use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn binary_search<T>(values: &[T], target: &T, compare: Comparator<T>) -> isize {
    let (mut low, mut high) = (0, values.len());
    while low < high {
        let mid = low + (high - low) / 2;
        match compare(&values[mid], target) {
            Ordering::Equal => return mid as isize,
            Ordering::Less => low = mid + 1,
            Ordering::Greater => high = mid,
        }
    }
    -1
}

pub fn binary_search_recursive<T>(values: &[T], target: &T, compare: Comparator<T>) -> isize {
    fn visit<T>(a: &[T], t: &T, c: Comparator<T>, low: usize, high: usize) -> isize {
        if low >= high {
            return -1;
        }
        let mid = low + (high - low) / 2;
        match c(&a[mid], t) {
            Ordering::Equal => mid as isize,
            Ordering::Less => visit(a, t, c, mid + 1, high),
            Ordering::Greater => visit(a, t, c, low, mid),
        }
    }
    visit(values, target, compare, 0, values.len())
}

pub fn lower_bound<T>(a: &[T], t: &T, c: Comparator<T>) -> usize {
    let (mut low, mut high) = (0, a.len());
    while low < high {
        let mid = low + (high - low) / 2;
        if c(&a[mid], t) == Ordering::Less {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    low
}

pub fn upper_bound<T>(a: &[T], t: &T, c: Comparator<T>) -> usize {
    let (mut low, mut high) = (0, a.len());
    while low < high {
        let mid = low + (high - low) / 2;
        if c(&a[mid], t) == Ordering::Greater {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    low
}

pub fn first_true(mut low: i64, mut high: i64, predicate: impl Fn(i64) -> bool) -> i64 {
    while low < high {
        let mid = low + (high - low) / 2;
        if predicate(mid) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    low
}
