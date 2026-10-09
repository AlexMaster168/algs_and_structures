package rangequeries

type FenwickTree struct{ tree []float64 }

func NewFenwickTree(values []float64) *FenwickTree {
	a := append([]float64{0}, values...)
	for i := 1; i < len(a); i++ {
		p := i + (i & -i)
		if p < len(a) {
			a[p] += a[i]
		}
	}
	return &FenwickTree{a}
}
func NewFenwickTreeSize(n int) *FenwickTree { return NewFenwickTree(make([]float64, n)) }
func (f *FenwickTree) Size() int            { return len(f.tree) - 1 }
func (f *FenwickTree) Add(i int, d float64) {
	if i < 0 || i >= f.Size() {
		panic("index out of bounds")
	}
	for i++; i < len(f.tree); i += i & -i {
		f.tree[i] += d
	}
}
func (f *FenwickTree) Set(i int, v float64) { f.Add(i, v-f.RangeSum(i, i)) }
func (f *FenwickTree) PrefixSum(i int) float64 {
	s := 0.0
	for i = min(i+1, f.Size()); i > 0; i -= i & -i {
		s += f.tree[i]
	}
	return s
}
func (f *FenwickTree) RangeSum(l, r int) float64 { return f.PrefixSum(r) - f.PrefixSum(l-1) }
