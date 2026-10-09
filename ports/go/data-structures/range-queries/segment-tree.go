package rangequeries

import "math"

type SegmentTree[T any] struct {
	n        int
	tree     []T
	combine  func(T, T) T
	identity T
}

func NewSegmentTree[T any](a []T, c func(T, T) T, id T) *SegmentTree[T] {
	n := len(a)
	t := make([]T, 2*n)
	for i := range t {
		t[i] = id
	}
	copy(t[n:], a)
	for i := n - 1; i > 0; i-- {
		t[i] = c(t[2*i], t[2*i+1])
	}
	return &SegmentTree[T]{n, t, c, id}
}
func (t *SegmentTree[T]) Size() int { return t.n }
func (t *SegmentTree[T]) Get(i int) T {
	if i < 0 || i >= t.n {
		panic("index out of bounds")
	}
	return t.tree[t.n+i]
}
func (t *SegmentTree[T]) Update(i int, v T) {
	if i < 0 || i >= t.n {
		panic("index out of bounds")
	}
	p := t.n + i
	t.tree[p] = v
	for p /= 2; p > 0; p /= 2 {
		t.tree[p] = t.combine(t.tree[2*p], t.tree[2*p+1])
	}
}
func (t *SegmentTree[T]) Query(l, r int) T {
	if l < 0 || r >= t.n || l > r {
		panic("invalid range")
	}
	a, b := t.identity, t.identity
	for l, r = l+t.n, r+t.n+1; l < r; l, r = l/2, r/2 {
		if l&1 != 0 {
			a = t.combine(a, t.tree[l])
			l++
		}
		if r&1 != 0 {
			r--
			b = t.combine(t.tree[r], b)
		}
	}
	return t.combine(a, b)
}
func SumSegmentTree(a []float64) *SegmentTree[float64] {
	return NewSegmentTree(a, func(a, b float64) float64 { return a + b }, 0.0)
}
func MinSegmentTree(a []float64) *SegmentTree[float64] {
	return NewSegmentTree(a, math.Min, math.Inf(1))
}
func MaxSegmentTree(a []float64) *SegmentTree[float64] {
	return NewSegmentTree(a, math.Max, math.Inf(-1))
}
