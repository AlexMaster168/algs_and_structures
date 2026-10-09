pub fn prefix_function(pattern: &str) -> Vec<usize> {
    prefix_units(&pattern.encode_utf16().collect::<Vec<_>>())
}

fn prefix_units(pattern: &[u16]) -> Vec<usize> {
    let mut pi = vec![0; pattern.len()];
    for i in 1..pattern.len() {
        let mut k = pi[i - 1];
        while k > 0 && pattern[i] != pattern[k] {
            k = pi[k - 1];
        }
        if pattern[i] == pattern[k] {
            k += 1;
        }
        pi[i] = k;
    }
    pi
}

pub fn kmp_search(text: &str, pattern: &str) -> Vec<usize> {
    let p: Vec<u16> = pattern.encode_utf16().collect();
    if p.is_empty() {
        return vec![];
    }
    let pi = prefix_units(&p);
    let mut matches = Vec::new();
    let mut k = 0;
    for (i, c) in text.encode_utf16().enumerate() {
        while k > 0 && c != p[k] {
            k = pi[k - 1];
        }
        if c == p[k] {
            k += 1;
        }
        if k == p.len() {
            matches.push(i + 1 - k);
            k = pi[k - 1];
        }
    }
    matches
}
