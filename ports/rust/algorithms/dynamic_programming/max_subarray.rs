#[derive(Debug, Clone, Copy, PartialEq)]
pub struct MaxSubarray {
    pub sum: f64,
    pub start: usize,
    pub end: usize,
}

pub fn max_subarray(values: &[f64]) -> MaxSubarray {
    assert!(!values.is_empty());
    let mut best = MaxSubarray {
        sum: values[0],
        start: 0,
        end: 0,
    };
    let (mut sum, mut start) = (values[0], 0);
    for (i, &v) in values.iter().enumerate().skip(1) {
        if sum < 0.0 {
            sum = v;
            start = i;
        } else {
            sum += v;
        }
        if sum > best.sum {
            best = MaxSubarray { sum, start, end: i };
        }
    }
    best
}
