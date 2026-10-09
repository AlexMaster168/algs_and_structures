package graphs

func FloodFill(image [][]int, row, col, color int) [][]int {
	r := make([][]int, len(image))
	for i := range image {
		r[i] = append([]int{}, image[i]...)
	}
	if row < 0 || row >= len(r) || col < 0 || col >= len(r[row]) {
		return r
	}
	original := r[row][col]
	if original == color {
		return r
	}
	stack := [][2]int{{row, col}}
	for len(stack) > 0 {
		p := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		i, j := p[0], p[1]
		if i < 0 || i >= len(r) || j < 0 || j >= len(r[i]) || r[i][j] != original {
			continue
		}
		r[i][j] = color
		stack = append(stack, [2]int{i + 1, j}, [2]int{i - 1, j}, [2]int{i, j + 1}, [2]int{i, j - 1})
	}
	return r
}
