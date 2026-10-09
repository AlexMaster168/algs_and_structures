package techniques

type PrefixSums struct{ prefix []float64 }

func NewPrefixSums(a []float64) *PrefixSums {
	p := []float64{0}
	for _, v := range a {
		p = append(p, p[len(p)-1]+v)
	}
	return &PrefixSums{p}
}
func (p *PrefixSums) Sum(l, r int) float64 { return p.prefix[r+1] - p.prefix[l] }

type PrefixSums2D struct{ prefix [][]float64 }

func NewPrefixSums2D(a [][]float64) *PrefixSums2D {
	n, m := len(a), 0
	if n > 0 {
		m = len(a[0])
	}
	p := make([][]float64, n+1)
	for i := range p {
		p[i] = make([]float64, m+1)
	}
	for i := 0; i < n; i++ {
		for j := 0; j < m; j++ {
			p[i+1][j+1] = a[i][j] + p[i][j+1] + p[i+1][j] - p[i][j]
		}
	}
	return &PrefixSums2D{p}
}
func (p *PrefixSums2D) Sum(t, l, b, r int) float64 {
	a := p.prefix
	return a[b+1][r+1] - a[t][r+1] - a[b+1][l] + a[t][l]
}
func SubarraySumEquals(a []float64, target float64) int {
	s := map[float64]int{0: 1}
	sum, c := 0.0, 0
	for _, v := range a {
		sum += v
		c += s[sum-target]
		s[sum]++
	}
	return c
}

type RangeUpdate struct {
	Left, Right int
	Delta       float64
}

func DifferenceArrayApply(n int, u []RangeUpdate) []float64 {
	d := make([]float64, n+1)
	for _, v := range u {
		d[v.Left] += v.Delta
		d[v.Right+1] -= v.Delta
	}
	r := make([]float64, n)
	s := 0.0
	for i := range r {
		s += d[i]
		r[i] = s
	}
	return r
}
func MajorityElement(a []float64) (float64, bool) {
	v, c := 0.0, 0
	for _, x := range a {
		if c == 0 {
			v = x
		}
		if x == v {
			c++
		} else {
			c--
		}
	}
	c = 0
	for _, x := range a {
		if x == v {
			c++
		}
	}
	return v, c > len(a)/2
}
