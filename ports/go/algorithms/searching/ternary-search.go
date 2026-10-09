package searching

func TernarySearchMax(f func(float64) float64, l, h float64, eps ...float64) float64 {
	e := 1e-9
	if len(eps) > 0 {
		e = eps[0]
	}
	if e <= 0 {
		panic("invalid epsilon")
	}
	for h-l > e {
		a, b := l+(h-l)/3, h-(h-l)/3
		if f(a) < f(b) {
			l = a
		} else {
			h = b
		}
	}
	return (l + h) / 2
}
func TernarySearchMin(f func(float64) float64, l, h float64, eps ...float64) float64 {
	return TernarySearchMax(func(x float64) float64 { return -f(x) }, l, h, eps...)
}
func FindPeakIndex(a []float64) int {
	l, h := 0, len(a)-1
	for l < h {
		m := (l + h) / 2
		if a[m] < a[m+1] {
			l = m + 1
		} else {
			h = m
		}
	}
	return l
}
