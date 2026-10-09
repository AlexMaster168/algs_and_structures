use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn selection_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    for i in 0..a.len() {
        let mut best = i;
        for j in i + 1..a.len() {
            if compare(&a[j], &a[best]) == Ordering::Less {
                best = j;
            }
        }
        a.swap(i, best);
    }
    a
}
