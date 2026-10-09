use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn bubble_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    for end in (1..a.len()).rev() {
        let mut changed = false;
        for i in 0..end {
            if compare(&a[i], &a[i + 1]) == Ordering::Greater {
                a.swap(i, i + 1);
                changed = true;
            }
        }
        if !changed {
            break;
        }
    }
    a
}
