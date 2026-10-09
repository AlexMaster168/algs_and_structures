pub fn longest_palindromic_substring(s: &str) -> String {
    let units: Vec<u16> = s.encode_utf16().collect();
    if units.len() < 2 {
        return s.into();
    }
    let mut transformed = vec![65537u32, 65536];
    for &c in &units {
        transformed.push(c as u32);
        transformed.push(65536);
    }
    transformed.push(65538);
    let mut radius = vec![0; transformed.len()];
    let (mut center, mut right, mut best) = (0, 0, 0);
    for i in 1..transformed.len() - 1 {
        if i < right {
            radius[i] = (right - i).min(radius[2 * center - i]);
        }
        while transformed[i + radius[i] + 1] == transformed[i - radius[i] - 1] {
            radius[i] += 1;
        }
        if i + radius[i] > right {
            center = i;
            right = i + radius[i];
        }
        if radius[i] > radius[best] {
            best = i;
        }
    }
    let start = (best - radius[best]) / 2;
    String::from_utf16_lossy(&units[start..start + radius[best]])
}
