use std::collections::HashMap;

pub fn boyer_moore_horspool(text: &str, pattern: &str) -> Vec<usize> {
    let t: Vec<u16> = text.encode_utf16().collect();
    let p: Vec<u16> = pattern.encode_utf16().collect();
    let n = p.len();
    if n == 0 || n > t.len() {
        return vec![];
    }
    let mut shift = HashMap::new();
    for i in 0..n - 1 {
        shift.insert(p[i], n - 1 - i);
    }
    let mut matches = Vec::new();
    let mut start = 0;
    while start + n <= t.len() {
        let mut j = n;
        while j > 0 && p[j - 1] == t[start + j - 1] {
            j -= 1;
        }
        if j == 0 {
            matches.push(start);
        }
        start += shift.get(&t[start + n - 1]).copied().unwrap_or(n);
    }
    matches
}
