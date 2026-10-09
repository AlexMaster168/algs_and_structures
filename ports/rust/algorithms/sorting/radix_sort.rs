pub fn radix_sort(input: &[i64], base: usize) -> Vec<i64> {
    assert!(base >= 2);
    fn nonnegative(mut a: Vec<u64>, base: usize) -> Vec<u64> {
        let maximum = a.iter().copied().max().unwrap_or(0);
        let mut exponent = 1u64;
        while maximum / exponent > 0 {
            let mut buckets = vec![Vec::new(); base];
            for v in a {
                buckets[((v / exponent) % (base as u64)) as usize].push(v);
            }
            a = buckets.into_iter().flatten().collect();
            match exponent.checked_mul(base as u64) {
                Some(next) => exponent = next,
                None => break,
            }
        }
        a
    }
    let negatives = nonnegative(
        input
            .iter()
            .filter(|&&v| v < 0)
            .map(|v| v.unsigned_abs())
            .collect(),
        base,
    );
    let positives = nonnegative(
        input
            .iter()
            .filter(|&&v| v >= 0)
            .map(|&v| v as u64)
            .collect(),
        base,
    );
    negatives
        .into_iter()
        .rev()
        .map(|v| (-(v as i128)) as i64)
        .chain(positives.into_iter().map(|v| v as i64))
        .collect()
}
