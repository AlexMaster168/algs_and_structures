pub fn rod_cutting(prices: &[f64], length: usize) -> (f64, Vec<usize>) {
    let mut best = vec![0.0f64; length + 1];
    let mut first = vec![0; length + 1];
    for n in 1..=length {
        best[n] = f64::NEG_INFINITY;
        for piece in 1..=n.min(prices.len()) {
            let candidate = prices[piece - 1] + best[n - piece];
            if candidate > best[n] {
                best[n] = candidate;
                first[n] = piece;
            }
        }
    }
    let mut pieces = Vec::new();
    let mut left = length;
    while left > 0 {
        let piece = first[left];
        assert!(piece > 0, "No feasible cut");
        pieces.push(piece);
        left -= piece;
    }
    (best[length], pieces)
}
