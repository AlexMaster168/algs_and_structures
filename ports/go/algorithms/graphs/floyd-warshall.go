package graphs

import "math"

type FloydWarshallResult struct {
	Distance         [][]float64
	Next             [][]int
	HasNegativeCycle bool
}

func FloydWarshall(w [][]float64) FloydWarshallResult {
	n := len(w)
	d, next := make([][]float64, n), make([][]int, n)
	for i := range w {
		d[i] = append([]float64{}, w[i]...)
		next[i] = filled(n, -1)
		for j, v := range w[i] {
			if i == j || !math.IsInf(v, 1) {
				next[i][j] = j
			}
		}
		if d[i][i] > 0 {
			d[i][i] = 0
		}
	}
	for k := 0; k < n; k++ {
		for i := 0; i < n; i++ {
			if math.IsInf(d[i][k], 1) {
				continue
			}
			for j := 0; j < n; j++ {
				c := d[i][k] + d[k][j]
				if c < d[i][j] {
					d[i][j] = c
					next[i][j] = next[i][k]
				}
			}
		}
	}
	neg := false
	for i := 0; i < n; i++ {
		neg = neg || d[i][i] < 0
	}
	return FloydWarshallResult{d, next, neg}
}
func FloydWarshallPath(next [][]int, s, t int) []int {
	if next[s][t] == -1 {
		return nil
	}
	p := []int{s}
	for s != t {
		s = next[s][t]
		p = append(p, s)
		if len(p) > len(next)+1 {
			panic("cyclic path")
		}
	}
	return p
}
