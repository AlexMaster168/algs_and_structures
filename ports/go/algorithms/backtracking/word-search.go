package backtracking

import "unicode/utf16"

func WordSearch(grid []string, word string) bool {
	rows := make([][]uint16, len(grid))
	visited := make([][]bool, len(grid))
	for i, s := range grid {
		rows[i] = utf16.Encode([]rune(s))
		visited[i] = make([]bool, len(rows[i]))
	}
	target := utf16.Encode([]rune(word))
	var search func(int, int, int) bool
	search = func(r, c, index int) bool {
		if index == len(target) {
			return true
		}
		if r < 0 || r >= len(rows) || c < 0 || c >= len(rows[r]) || visited[r][c] || rows[r][c] != target[index] {
			return false
		}
		visited[r][c] = true
		found := search(r+1, c, index+1) || search(r-1, c, index+1) || search(r, c+1, index+1) || search(r, c-1, index+1)
		visited[r][c] = false
		return found
	}
	for r, row := range rows {
		for c := range row {
			if search(r, c, 0) {
				return true
			}
		}
	}
	return false
}
