use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn shell_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    let mut gap = a.len() / 2;
    while gap > 0 {
        for i in gap..a.len() {
            let value = a[i].clone();
            let mut j = i;
            while j >= gap && compare(&a[j - gap], &value) == Ordering::Greater {
                a[j] = a[j - gap].clone();
                j -= gap;
            }
            a[j] = value;
        }
        gap /= 2;
    }
    a
}
