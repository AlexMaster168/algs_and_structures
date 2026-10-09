package searching

func InterpolationSearch(a []float64, t float64) int {
	l, h := 0, len(a)-1
	for l <= h && t >= a[l] && t <= a[h] {
		if a[h] == a[l] {
			if a[l] == t {
				return l
			}
			return -1
		}
		p := l + int((t-a[l])*float64(h-l)/(a[h]-a[l]))
		if a[p] == t {
			return p
		}
		if a[p] < t {
			l = p + 1
		} else {
			h = p - 1
		}
	}
	return -1
}
