pub type SudokuBoard = Vec<Vec<u8>>;
pub fn solve_sudoku(input: &[Vec<u8>]) -> Option<SudokuBoard> {
    if input.len() != 9 || input.iter().any(|row| row.len() != 9) {
        return None;
    }
    let mut board = input.to_vec();
    let (mut rows, mut cols, mut boxes) = ([0u16; 9], [0u16; 9], [0u16; 9]);
    let mut empty = Vec::new();
    for r in 0..9 {
        for c in 0..9 {
            let value = board[r][c];
            if value == 0 {
                empty.push((r, c));
                continue;
            }
            if value > 9 {
                return None;
            }
            let bit = 1 << value;
            let b = r / 3 * 3 + c / 3;
            if (rows[r] | cols[c] | boxes[b]) & bit != 0 {
                return None;
            }
            rows[r] |= bit;
            cols[c] |= bit;
            boxes[b] |= bit;
        }
    }
    fn solve(
        board: &mut SudokuBoard,
        empty: &[(usize, usize)],
        i: usize,
        rows: &mut [u16; 9],
        cols: &mut [u16; 9],
        boxes: &mut [u16; 9],
    ) -> bool {
        if i == empty.len() {
            return true;
        }
        let (r, c) = empty[i];
        let b = r / 3 * 3 + c / 3;
        for value in 1..=9 {
            let bit = 1 << value;
            if (rows[r] | cols[c] | boxes[b]) & bit != 0 {
                continue;
            }
            board[r][c] = value;
            rows[r] |= bit;
            cols[c] |= bit;
            boxes[b] |= bit;
            if solve(board, empty, i + 1, rows, cols, boxes) {
                return true;
            }
            rows[r] ^= bit;
            cols[c] ^= bit;
            boxes[b] ^= bit;
        }
        board[r][c] = 0;
        false
    }
    solve(&mut board, &empty, 0, &mut rows, &mut cols, &mut boxes).then_some(board)
}
