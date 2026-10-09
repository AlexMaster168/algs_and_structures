pub fn rabin_karp(text: &str, pattern: &str) -> Vec<usize> {
    let t: Vec<u16> = text.encode_utf16().collect();
    let p: Vec<u16> = pattern.encode_utf16().collect();
    let n = p.len();
    if n == 0 || n > t.len() {
        return vec![];
    }
    let modulus = 1_000_000_007u64;
    let base = 257u64;
    let (mut power, mut expected, mut hash) = (1, 0, 0);
    for i in 0..n {
        if i > 0 {
            power = power * base % modulus;
        }
        expected = (expected * base + p[i] as u64) % modulus;
        hash = (hash * base + t[i] as u64) % modulus;
    }
    let mut matches = Vec::new();
    for i in 0..=t.len() - n {
        if hash == expected && t[i..i + n] == p {
            matches.push(i);
        }
        if i + n < t.len() {
            hash = ((hash + modulus - (t[i] as u64 * power % modulus)) * base + t[i + n] as u64)
                % modulus;
        }
    }
    matches
}
