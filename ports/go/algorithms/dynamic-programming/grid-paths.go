package dp

import "math"

func UniquePaths(rows, cols int, blocked ...[][]bool) int {
	if cols <= 0 || rows <= 0 {
		return 0
	}
	w := make([]int, cols)
	w[0] = 1
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			b := len(blocked) > 0 && r < len(blocked[0]) && c < len(blocked[0][r]) && blocked[0][r][c]
			if b {
				w[c] = 0
			} else if c > 0 {
				w[c] += w[c-1]
			}
		}
	}
	return w[cols-1]
}
func MinPathSum(grid [][]float64) float64 {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return math.Inf(1)
	}
	n := len(grid[0])
	b := make([]float64, n)
	for i := range b {
		b[i] = math.Inf(1)
	}
	b[0] = 0
	for _, row := range grid {
		for c, v := range row {
			l := math.Inf(1)
			if c > 0 {
				l = b[c-1]
			}
			b[c] = v + min(b[c], l)
		}
	}
	return b[n-1]
}
