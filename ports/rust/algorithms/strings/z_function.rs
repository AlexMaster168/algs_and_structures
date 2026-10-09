fn z_units(s: &[u32]) -> Vec<usize> {
    let mut z = vec![0; s.len()];
    if !s.is_empty() {
        z[0] = s.len();
    }
    let (mut left, mut right) = (0, 0);
    for i in 1..s.len() {
        if i < right {
            z[i] = (right - i).min(z[i - left]);
        }
        while i + z[i] < s.len() && s[z[i]] == s[i + z[i]] {
            z[i] += 1;
        }
        if i + z[i] > right {
            left = i;
            right = i + z[i];
        }
    }
    z
}

pub fn z_function(s: &str) -> Vec<usize> {
    z_units(&s.encode_utf16().map(u32::from).collect::<Vec<_>>())
}

pub fn z_search(text: &str, pattern: &str) -> Vec<usize> {
    let mut units: Vec<u32> = pattern.encode_utf16().map(u32::from).collect();
    let n = units.len();
    if n == 0 {
        return vec![];
    }
    units.push(65536);
    units.extend(text.encode_utf16().map(u32::from));
    z_units(&units)
        .into_iter()
        .enumerate()
        .skip(n + 1)
        .filter_map(|(i, z)| if z >= n { Some(i - n - 1) } else { None })
        .collect()
}
