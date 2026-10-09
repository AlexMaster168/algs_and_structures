package rangequeries

import "math"

type SparseTable[T any] struct {
	table   [][]T
	log     []int
	combine func(T, T) T
}

func NewSparseTable[T any](a []T, c func(T, T) T) *SparseTable[T] {
	n := len(a)
	log := make([]int, n+1)
	for i := 2; i <= n; i++ {
		log[i] = log[i/2] + 1
	}
	t := [][]T{append([]T{}, a...)}
	for l := 1; 1<<l <= n; l++ {
		h := 1 << (l - 1)
		r := []T{}
		for i := 0; i+(1<<l) <= n; i++ {
			r = append(r, c(t[l-1][i], t[l-1][i+h]))
		}
		t = append(t, r)
	}
	return &SparseTable[T]{t, log, c}
}
func (t *SparseTable[T]) Query(l, r int) T {
	if l < 0 || r >= len(t.table[0]) || l > r {
		panic("invalid range")
	}
	k := t.log[r-l+1]
	return t.combine(t.table[k][l], t.table[k][r-(1<<k)+1])
}
func MinSparseTable(a []float64) *SparseTable[float64] { return NewSparseTable(a, math.Min) }
func MaxSparseTable(a []float64) *SparseTable[float64] { return NewSparseTable(a, math.Max) }
