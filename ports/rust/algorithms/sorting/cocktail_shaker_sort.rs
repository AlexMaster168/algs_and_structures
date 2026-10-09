use crate::shared::compare::Comparator;
use std::cmp::Ordering;

pub fn cocktail_shaker_sort<T: Clone>(input: &[T], compare: Comparator<T>) -> Vec<T> {
    let mut a = input.to_vec();
    if a.len() < 2 {
        return a;
    }
    let (mut left, mut right) = (0, a.len() - 1);
    while left < right {
        let mut changed = false;
        for i in left..right {
            if compare(&a[i], &a[i + 1]) == Ordering::Greater {
                a.swap(i, i + 1);
                changed = true;
            }
        }
        if !changed {
            break;
        }
        right -= 1;
        changed = false;
        for i in (left + 1..=right).rev() {
            if compare(&a[i - 1], &a[i]) == Ordering::Greater {
                a.swap(i - 1, i);
                changed = true;
            }
        }
        if !changed {
            break;
        }
        left += 1;
    }
    a
}
