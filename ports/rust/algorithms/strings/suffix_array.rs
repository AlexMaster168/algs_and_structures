pub fn suffix_array(s: &str) -> Vec<usize> {
    let units: Vec<u16> = s.encode_utf16().collect();
    let n = units.len();
    if n == 0 {
        return vec![];
    }
    let mut rank: Vec<i64> = units.iter().map(|&c| c as i64).collect();
    let mut suffixes: Vec<usize> = (0..n).collect();
    let mut k = 1;
    loop {
        let key = |i: usize| (rank[i], if i + k < n { rank[i + k] } else { -1 });
        suffixes.sort_by_key(|&i| key(i));
        let mut next = vec![0; n];
        for i in 1..n {
            next[suffixes[i]] = next[suffixes[i - 1]]
                + if key(suffixes[i]) != key(suffixes[i - 1]) {
                    1
                } else {
                    0
                };
        }
        rank = next;
        if rank[suffixes[n - 1]] == n as i64 - 1 {
            break;
        }
        k *= 2;
    }
    suffixes
}

pub fn lcp_array(s: &str, suffixes: &[usize]) -> Vec<usize> {
    let units: Vec<u16> = s.encode_utf16().collect();
    let n = units.len();
    assert_eq!(suffixes.len(), n);
    if n == 0 {
        return vec![];
    }
    let mut rank = vec![0; n];
    for (i, &suffix) in suffixes.iter().enumerate() {
        rank[suffix] = i;
    }
    let mut lcp = vec![0; n - 1];
    let mut h = 0;
    for i in 0..n {
        if rank[i] == 0 {
            h = 0;
            continue;
        }
        let j = suffixes[rank[i] - 1];
        while i + h < n && j + h < n && units[i + h] == units[j + h] {
            h += 1;
        }
        lcp[rank[i] - 1] = h;
        h = h.saturating_sub(1);
    }
    lcp
}

pub fn count_distinct_substrings(s: &str) -> usize {
    let n = s.encode_utf16().count();
    n * (n + 1) / 2 - lcp_array(s, &suffix_array(s)).iter().sum::<usize>()
}
