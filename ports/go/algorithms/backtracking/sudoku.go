package backtracking

func SolveSudoku(input [][]int) [][]int {
	if len(input) != 9 {
		return nil
	}
	board := make([][]int, 9)
	var rows, cols, boxes [9][10]bool
	empty := [][2]int{}
	box := func(r, c int) int { return r/3*3 + c/3 }
	for r := 0; r < 9; r++ {
		if len(input[r]) != 9 {
			return nil
		}
		board[r] = append([]int{}, input[r]...)
		for c, v := range board[r] {
			if v == 0 {
				empty = append(empty, [2]int{r, c})
				continue
			}
			b := box(r, c)
			if v < 1 || v > 9 || rows[r][v] || cols[c][v] || boxes[b][v] {
				return nil
			}
			rows[r][v], cols[c][v], boxes[b][v] = true, true, true
		}
	}
	var fill func(int) bool
	fill = func(index int) bool {
		if index == len(empty) {
			return true
		}
		r, c := empty[index][0], empty[index][1]
		b := box(r, c)
		for v := 1; v <= 9; v++ {
			if rows[r][v] || cols[c][v] || boxes[b][v] {
				continue
			}
			board[r][c] = v
			rows[r][v], cols[c][v], boxes[b][v] = true, true, true
			if fill(index + 1) {
				return true
			}
			board[r][c] = 0
			rows[r][v], cols[c][v], boxes[b][v] = false, false, false
		}
		return false
	}
	if fill(0) {
		return board
	}
	return nil
}
