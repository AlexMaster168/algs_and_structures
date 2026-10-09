pub fn flood_fill(image: &[Vec<f64>], row: usize, col: usize, color: f64) -> Vec<Vec<f64>> {
    let mut result = image.to_vec();
    let original = image[row][col];
    if original == color {
        return result;
    }
    let rows = image.len();
    let cols = image[0].len();
    let mut stack = vec![(row, col)];
    result[row][col] = color;
    while let Some((r, c)) = stack.pop() {
        for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
            let nr = r as isize + dr;
            let nc = c as isize + dc;
            if nr >= 0 && nc >= 0 && nr < rows as isize && nc < cols as isize {
                let (nr, nc) = (nr as usize, nc as usize);
                if result[nr][nc] == original {
                    result[nr][nc] = color;
                    stack.push((nr, nc));
                }
            }
        }
    }
    result
}
