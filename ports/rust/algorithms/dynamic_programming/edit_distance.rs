pub fn edit_distance(source: &str, target: &str) -> usize {
    let a: Vec<u16> = source.encode_utf16().collect();
    let b: Vec<u16> = target.encode_utf16().collect();
    let mut previous: Vec<usize> = (0..=b.len()).collect();
    for i in 1..=a.len() {
        let mut current = vec![0; b.len() + 1];
        current[0] = i;
        for j in 1..=b.len() {
            current[j] = if a[i - 1] == b[j - 1] {
                previous[j - 1]
            } else {
                1 + previous[j].min(current[j - 1]).min(previous[j - 1])
            };
        }
        previous = current;
    }
    previous[b.len()]
}
