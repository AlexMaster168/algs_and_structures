pub fn word_search(grid: &[String], word: &str) -> bool {
    let grid: Vec<Vec<u16>> = grid
        .iter()
        .map(|row| row.encode_utf16().collect())
        .collect();
    let word: Vec<_> = word.encode_utf16().collect();
    if word.is_empty() {
        return true;
    }
    if grid.is_empty() {
        return false;
    }
    let rows = grid.len();
    let cols = grid[0].len();
    let mut seen = vec![vec![false; cols]; rows];
    fn search(
        grid: &[Vec<u16>],
        word: &[u16],
        seen: &mut [Vec<bool>],
        r: isize,
        c: isize,
        i: usize,
    ) -> bool {
        if i == word.len() {
            return true;
        }
        if r < 0 || c < 0 || r >= grid.len() as isize || c >= grid[0].len() as isize {
            return false;
        }
        let (r, c) = (r as usize, c as usize);
        if seen[r][c] || grid[r][c] != word[i] {
            return false;
        }
        seen[r][c] = true;
        let found = [(1, 0), (-1, 0), (0, 1), (0, -1)]
            .into_iter()
            .any(|(dr, dc)| search(grid, word, seen, r as isize + dr, c as isize + dc, i + 1));
        seen[r][c] = false;
        found
    }
    for r in 0..rows {
        for c in 0..cols {
            if search(&grid, &word, &mut seen, r as isize, c as isize, 0) {
                return true;
            }
        }
    }
    false
}
