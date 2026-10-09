package searching

import "math"

func JumpSearch(a []float64, t float64) int {
	n := len(a)
	if n == 0 {
		return -1
	}
	s := int(math.Sqrt(float64(n)))
	p, c := 0, s
	for c < n && a[c-1] < t {
		p = c
		c += s
	}
	for i := p; i < min(c, n); i++ {
		if a[i] == t {
			return i
		}
	}
	return -1
}
