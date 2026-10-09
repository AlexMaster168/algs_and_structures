use crate::algorithms::sorting::quick_sort::partition3;
use crate::shared::compare::Comparator;

pub fn quick_select<T: Clone>(input: &[T], k: usize, c: Comparator<T>) -> T {
    assert!(k < input.len());
    let mut a = input.to_vec();
    let (mut low, mut high) = (0, a.len() - 1);
    loop {
        let (left, right) = partition3(&mut a, low, high, c);
        if k < left {
            high = left - 1;
        } else if k > right {
            low = right + 1;
        } else {
            return a[k].clone();
        }
    }
}

pub fn median(values: &[f64]) -> f64 {
    assert!(!values.is_empty());
    let n = values.len();
    let right = quick_select(values, n / 2, f64::total_cmp);
    if n % 2 == 1 {
        right
    } else {
        (quick_select(values, n / 2 - 1, f64::total_cmp) + right) / 2.0
    }
}
