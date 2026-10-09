pub fn n_queens(n: usize) -> Vec<Vec<String>> {
    fn place(
        n: usize,
        row: usize,
        columns: &mut [bool],
        down: &mut [bool],
        up: &mut [bool],
        positions: &mut Vec<usize>,
        result: &mut Vec<Vec<String>>,
    ) {
        if row == n {
            result.push(
                positions
                    .iter()
                    .map(|&column| {
                        (0..n)
                            .map(|c| if c == column { 'Q' } else { '.' })
                            .collect()
                    })
                    .collect(),
            );
            return;
        }
        for column in 0..n {
            let a = row + column;
            let b = row + n - column;
            if columns[column] || down[a] || up[b] {
                continue;
            }
            columns[column] = true;
            down[a] = true;
            up[b] = true;
            positions.push(column);
            place(n, row + 1, columns, down, up, positions, result);
            positions.pop();
            columns[column] = false;
            down[a] = false;
            up[b] = false;
        }
    }
    let mut result = Vec::new();
    place(
        n,
        0,
        &mut vec![false; n],
        &mut vec![false; n * 2 + 1],
        &mut vec![false; n * 2 + 1],
        &mut Vec::new(),
        &mut result,
    );
    result
}
pub fn count_n_queens(n: u32) -> u64 {
    assert!(n <= 31);
    fn count(mask: u32, columns: u32, left: u32, right: u32) -> u64 {
        if columns == mask {
            return 1;
        }
        let mut available = mask & !(columns | left | right);
        let mut result = 0;
        while available != 0 {
            let bit = available & available.wrapping_neg();
            available ^= bit;
            result += count(mask, columns | bit, (left | bit) << 1, (right | bit) >> 1);
        }
        result
    }
    count((1u32 << n) - 1, 0, 0, 0)
}
