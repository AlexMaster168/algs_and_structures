pub fn mulberry32(seed: u32) -> impl FnMut() -> f64 {
    let mut state = seed;
    move || {
        state = state.wrapping_add(0x6d2b79f5);
        let mut t = (state ^ (state >> 15)).wrapping_mul(state | 1);
        t ^= t.wrapping_add((t ^ (t >> 7)).wrapping_mul(t | 61));
        (t ^ (t >> 14)) as f64 / 4294967296.0
    }
}
pub fn fisher_yates_shuffle<T: Clone>(input: &[T], mut random: impl FnMut() -> f64) -> Vec<T> {
    let mut result = input.to_vec();
    for i in (1..result.len()).rev() {
        let j = (random() * (i + 1) as f64).floor() as usize;
        result.swap(i, j);
    }
    result
}
pub fn reservoir_sample<T>(
    stream: impl IntoIterator<Item = T>,
    size: usize,
    mut random: impl FnMut() -> f64,
) -> Vec<T> {
    let mut result = Vec::new();
    for (index, item) in stream.into_iter().enumerate() {
        if result.len() < size {
            result.push(item);
        } else {
            let j = (random() * (index + 1) as f64).floor() as usize;
            if j < size {
                result[j] = item;
            }
        }
    }
    result
}
pub fn monte_carlo_pi(samples: usize, mut random: impl FnMut() -> f64) -> f64 {
    let mut inside = 0;
    for _ in 0..samples {
        let x = random();
        let y = random();
        if x * x + y * y <= 1.0 {
            inside += 1;
        }
    }
    4.0 * inside as f64 / samples as f64
}
