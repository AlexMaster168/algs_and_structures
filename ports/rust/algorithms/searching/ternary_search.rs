pub fn ternary_search_max(
    f: impl Fn(f64) -> f64,
    mut low: f64,
    mut high: f64,
    epsilon: f64,
) -> f64 {
    assert!(epsilon > 0.0);
    while high - low > epsilon {
        let a = low + (high - low) / 3.0;
        let b = high - (high - low) / 3.0;
        if f(a) < f(b) {
            low = a;
        } else {
            high = b;
        }
    }
    (low + high) / 2.0
}

pub fn ternary_search_min(f: impl Fn(f64) -> f64, low: f64, high: f64, epsilon: f64) -> f64 {
    ternary_search_max(|x| -f(x), low, high, epsilon)
}

pub fn find_peak_index(a: &[f64]) -> isize {
    if a.is_empty() {
        return -1;
    }
    let (mut low, mut high) = (0, a.len() - 1);
    while low < high {
        let mid = low + (high - low) / 2;
        if a[mid] < a[mid + 1] {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    low as isize
}
