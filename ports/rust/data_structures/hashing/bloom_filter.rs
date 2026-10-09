use super::hash::fnv1a;
pub struct BloomFilter {
    pub bit_count: usize,
    pub hash_count: usize,
    bits: Vec<u8>,
}
impl BloomFilter {
    pub fn new(expected_items: usize, false_positive_rate: f64) -> Self {
        assert!(expected_items > 0 && false_positive_rate > 0.0 && false_positive_rate < 1.0);
        let bit_count = (-(expected_items as f64) * false_positive_rate.ln()
            / std::f64::consts::LN_2.powi(2))
        .ceil()
        .max(8.0) as usize;
        let hash_count = ((bit_count as f64 / expected_items as f64) * std::f64::consts::LN_2)
            .round()
            .max(1.0) as usize;
        Self {
            bit_count,
            hash_count,
            bits: vec![0; bit_count.div_ceil(8)],
        }
    }
    fn positions(&self, item: &str) -> Vec<usize> {
        let h1 = fnv1a(item, 0x811c9dc5) as u64;
        let h2 = (fnv1a(item, 0x5bd1e995) | 1) as u64;
        (0..self.hash_count)
            .map(|i| ((h1 + i as u64 * h2) % self.bit_count as u64) as usize)
            .collect()
    }
    pub fn add(&mut self, item: &str) -> &mut Self {
        for position in self.positions(item) {
            self.bits[position >> 3] |= 1 << (position & 7);
        }
        self
    }
    pub fn might_contain(&self, item: &str) -> bool {
        self.positions(item)
            .into_iter()
            .all(|position| self.bits[position >> 3] & (1 << (position & 7)) != 0)
    }
}
