package backtracking

import "strings"

func NQueens(n int) [][]string {
	if n < 0 {
		panic("negative board size")
	}
	result := [][]string{}
	columns := []int{}
	used := map[int]bool{}
	diagonals := map[int]bool{}
	anti := map[int]bool{}
	var place func(int)
	place = func(row int) {
		if row == n {
			board := []string{}
			for _, col := range columns {
				board = append(board, strings.Repeat(".", col)+"Q"+strings.Repeat(".", n-col-1))
			}
			result = append(result, board)
			return
		}
		for col := 0; col < n; col++ {
			if used[col] || diagonals[row-col] || anti[row+col] {
				continue
			}
			columns = append(columns, col)
			used[col], diagonals[row-col], anti[row+col] = true, true, true
			place(row + 1)
			columns = columns[:len(columns)-1]
			delete(used, col)
			delete(diagonals, row-col)
			delete(anti, row+col)
		}
	}
	place(0)
	return result
}
func CountNQueens(n int) int {
	if n < 0 || n > 31 {
		panic("board size must be between 0 and 31")
	}
	full := uint32(1)<<n - 1
	var count func(uint32, uint32, uint32) int
	count = func(columns, diagonals, anti uint32) int {
		if columns == full {
			return 1
		}
		total := 0
		free := full &^ (columns | diagonals | anti)
		for free != 0 {
			bit := free & -free
			free ^= bit
			total += count(columns|bit, (diagonals|bit)<<1&full, (anti|bit)>>1)
		}
		return total
	}
	return count(0, 0, 0)
}
