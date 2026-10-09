package dp

import (
	"math"
	"strconv"
)

type MatrixChainResult struct {
	Cost  float64
	Order string
}

func MatrixChainOrder(d []int) MatrixChainResult {
	n := len(d) - 1
	if n < 1 {
		return MatrixChainResult{}
	}
	c, s := make([][]float64, n), make([][]int, n)
	for i := 0; i < n; i++ {
		c[i] = make([]float64, n)
		s[i] = make([]int, n)
	}
	for l := 2; l <= n; l++ {
		for i := 0; i+l <= n; i++ {
			j := i + l - 1
			c[i][j] = math.Inf(1)
			for k := i; k < j; k++ {
				v := c[i][k] + c[k+1][j] + float64(d[i])*float64(d[k+1])*float64(d[j+1])
				if v < c[i][j] {
					c[i][j] = v
					s[i][j] = k
				}
			}
		}
	}
	var render func(int, int) string
	render = func(i, j int) string {
		if i == j {
			return "A" + strconv.Itoa(i+1)
		}
		return "(" + render(i, s[i][j]) + render(s[i][j]+1, j) + ")"
	}
	return MatrixChainResult{c[0][n-1], render(0, n-1)}
}
