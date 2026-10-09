package rangequeries

type LazySegmentTree struct {
	n             int
	sums, pending []float64
}

func NewLazySegmentTree(a []float64) *LazySegmentTree {
	t := &LazySegmentTree{len(a), make([]float64, 4*max(1, len(a))), make([]float64, 4*max(1, len(a)))}
	var build func(int, int, int)
	build = func(n, l, r int) {
		if l == r {
			t.sums[n] = a[l]
			return
		}
		m := (l + r) / 2
		build(2*n, l, m)
		build(2*n+1, m+1, r)
		t.sums[n] = t.sums[2*n] + t.sums[2*n+1]
	}
	if len(a) > 0 {
		build(1, 0, len(a)-1)
	}
	return t
}
func (t *LazySegmentTree) Size() int { return t.n }
func (t *LazySegmentTree) apply(n, l, r int, d float64) {
	t.sums[n] += d * float64(r-l+1)
	t.pending[n] += d
}
func (t *LazySegmentTree) push(n, l, r int) {
	d := t.pending[n]
	if d == 0 {
		return
	}
	m := (l + r) / 2
	t.apply(2*n, l, m, d)
	t.apply(2*n+1, m+1, r, d)
	t.pending[n] = 0
}
func (t *LazySegmentTree) check(l, r int) {
	if l < 0 || r >= t.n || l > r {
		panic("invalid range")
	}
}
func (t *LazySegmentTree) RangeAdd(left, right int, d float64) {
	t.check(left, right)
	var f func(int, int, int)
	f = func(n, l, r int) {
		if right < l || r < left {
			return
		}
		if left <= l && r <= right {
			t.apply(n, l, r, d)
			return
		}
		t.push(n, l, r)
		m := (l + r) / 2
		f(2*n, l, m)
		f(2*n+1, m+1, r)
		t.sums[n] = t.sums[2*n] + t.sums[2*n+1]
	}
	f(1, 0, t.n-1)
}
func (t *LazySegmentTree) RangeSum(left, right int) float64 {
	t.check(left, right)
	var f func(int, int, int) float64
	f = func(n, l, r int) float64 {
		if right < l || r < left {
			return 0
		}
		if left <= l && r <= right {
			return t.sums[n]
		}
		t.push(n, l, r)
		m := (l + r) / 2
		return f(2*n, l, m) + f(2*n+1, m+1, r)
	}
	return f(1, 0, t.n-1)
}
