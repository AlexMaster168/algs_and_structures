package mathalg

import "math"

type Matrix = [][]float64

func Identity(n int) Matrix {
	r := make(Matrix, n)
	for i := range r {
		r[i] = make([]float64, n)
		r[i][i] = 1
	}
	return r
}
func Multiply(a, b Matrix) Matrix {
	rows, inner, cols := len(a), len(b), 0
	if inner > 0 {
		cols = len(b[0])
	}
	width := 0
	if rows > 0 {
		width = len(a[0])
	}
	if width != inner {
		panic("matrix dimensions mismatch")
	}
	r := make(Matrix, rows)
	for i := range r {
		r[i] = make([]float64, cols)
		for k, v := range a[i] {
			if v == 0 {
				continue
			}
			for j := 0; j < cols; j++ {
				r[i][j] += v * b[k][j]
			}
		}
	}
	return r
}
func Transpose(a Matrix) Matrix {
	if len(a) == 0 {
		return Matrix{}
	}
	r := make(Matrix, len(a[0]))
	for j := range r {
		r[j] = make([]float64, len(a))
		for i := range a {
			r[j][i] = a[i][j]
		}
	}
	return r
}
func MatrixPower(a Matrix, e int) Matrix {
	r := Identity(len(a))
	for e > 0 {
		if e&1 != 0 {
			r = Multiply(r, a)
		}
		a = Multiply(a, a)
		e /= 2
	}
	return r
}
func Determinant(a Matrix) float64 {
	n := len(a)
	m := make(Matrix, n)
	for i := range a {
		m[i] = append([]float64{}, a[i]...)
	}
	det := 1.0
	for c := 0; c < n; c++ {
		p := c
		for r := c + 1; r < n; r++ {
			if math.Abs(m[r][c]) > math.Abs(m[p][c]) {
				p = r
			}
		}
		if math.Abs(m[p][c]) < 1e-12 {
			return 0
		}
		if p != c {
			m[p], m[c] = m[c], m[p]
			det = -det
		}
		det *= m[c][c]
		for r := c + 1; r < n; r++ {
			f := m[r][c] / m[c][c]
			for k := c; k < n; k++ {
				m[r][k] -= f * m[c][k]
			}
		}
	}
	return det
}
func SolveLinearSystem(a Matrix, b []float64) ([]float64, bool) {
	n := len(a)
	m := make(Matrix, n)
	for i := range a {
		m[i] = append(append([]float64{}, a[i]...), b[i])
	}
	for c := 0; c < n; c++ {
		p := c
		for r := c + 1; r < n; r++ {
			if math.Abs(m[r][c]) > math.Abs(m[p][c]) {
				p = r
			}
		}
		if math.Abs(m[p][c]) < 1e-12 {
			return nil, false
		}
		m[p], m[c] = m[c], m[p]
		for r := 0; r < n; r++ {
			if r == c {
				continue
			}
			f := m[r][c] / m[c][c]
			for k := c; k <= n; k++ {
				m[r][k] -= f * m[c][k]
			}
		}
	}
	r := make([]float64, n)
	for i := range r {
		r[i] = m[i][n] / m[i][i]
	}
	return r, true
}
