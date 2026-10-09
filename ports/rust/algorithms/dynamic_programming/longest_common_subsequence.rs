pub fn longest_common_subsequence(a: &str, b: &str) -> String {
    let a: Vec<u16> = a.encode_utf16().collect();
    let b: Vec<u16> = b.encode_utf16().collect();
    let mut table = vec![vec![0; b.len() + 1]; a.len() + 1];
    for i in 1..=a.len() {
        for j in 1..=b.len() {
            table[i][j] = if a[i - 1] == b[j - 1] {
                table[i - 1][j - 1] + 1
            } else {
                table[i - 1][j].max(table[i][j - 1])
            };
        }
    }
    let (mut i, mut j) = (a.len(), b.len());
    let mut result = Vec::new();
    while i > 0 && j > 0 {
        if a[i - 1] == b[j - 1] {
            result.push(a[i - 1]);
            i -= 1;
            j -= 1;
        } else if table[i - 1][j] >= table[i][j - 1] {
            i -= 1;
        } else {
            j -= 1;
        }
    }
    result.reverse();
    String::from_utf16_lossy(&result)
}

pub fn longest_common_substring(a: &str, b: &str) -> String {
    let a: Vec<u16> = a.encode_utf16().collect();
    let b: Vec<u16> = b.encode_utf16().collect();
    let mut previous = vec![0; b.len() + 1];
    let (mut best, mut end) = (0, 0);
    for i in 1..=a.len() {
        let mut current = vec![0; b.len() + 1];
        for j in 1..=b.len() {
            if a[i - 1] == b[j - 1] {
                current[j] = previous[j - 1] + 1;
                if current[j] > best {
                    best = current[j];
                    end = i;
                }
            }
        }
        previous = current;
    }
    String::from_utf16_lossy(&a[end - best..end])
}
