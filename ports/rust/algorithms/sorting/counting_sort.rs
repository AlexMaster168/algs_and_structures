pub fn counting_sort(input: &[i64]) -> Vec<i64> {
    if input.is_empty() {
        return vec![];
    }
    let minimum = *input.iter().min().unwrap();
    let maximum = *input.iter().max().unwrap();
    let width = usize::try_from(maximum as i128 - minimum as i128 + 1).expect("Range too large");
    let mut counts = vec![0usize; width];
    for &v in input {
        counts[(v as i128 - minimum as i128) as usize] += 1;
    }
    let mut result = Vec::with_capacity(input.len());
    for (i, count) in counts.into_iter().enumerate() {
        for _ in 0..count {
            result.push((minimum as i128 + i as i128) as i64);
        }
    }
    result
}
