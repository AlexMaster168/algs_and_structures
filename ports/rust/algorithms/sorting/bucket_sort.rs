pub fn bucket_sort(input: &[f64], bucket_count: usize) -> Vec<f64> {
    assert!(bucket_count > 0 && input.iter().all(|v| v.is_finite()));
    if input.len() < 2 {
        return input.to_vec();
    }
    let minimum = input.iter().copied().fold(f64::INFINITY, f64::min);
    let maximum = input.iter().copied().fold(f64::NEG_INFINITY, f64::max);
    if minimum == maximum {
        return input.to_vec();
    }
    let mut buckets = vec![Vec::new(); bucket_count];
    for &v in input {
        let index = (((v - minimum) / (maximum - minimum) * (bucket_count as f64)) as usize)
            .min(bucket_count - 1);
        buckets[index].push(v);
    }
    for bucket in &mut buckets {
        for i in 1..bucket.len() {
            let value = bucket[i];
            let mut j = i;
            while j > 0 && bucket[j - 1] > value {
                bucket[j] = bucket[j - 1];
                j -= 1;
            }
            bucket[j] = value;
        }
    }
    buckets.into_iter().flatten().collect()
}
