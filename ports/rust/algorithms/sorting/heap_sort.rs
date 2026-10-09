use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn heap_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    fn down<T>(a: &mut [T], mut i: usize, end: usize, c: Comparator<T>) {
        loop {
            let left = 2 * i + 1;
            if left >= end {
                break;
            }
            let mut best = left;
            if left + 1 < end && c(&a[left + 1], &a[left]) == Ordering::Greater {
                best = left + 1;
            }
            if c(&a[best], &a[i]) != Ordering::Greater {
                break;
            }
            a.swap(i, best);
            i = best;
        }
    }
    let mut a = input.to_vec();
    let n = a.len();
    for i in (0..n / 2).rev() {
        down(&mut a, i, n, compare);
    }
    for end in (1..n).rev() {
        a.swap(0, end);
        down(&mut a, 0, end, compare);
    }
    a
}
