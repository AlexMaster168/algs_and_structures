package dp

func LongestIncreasingSubsequence(a []float64) []float64 {
	tails := []int{}
	p := make([]int, len(a))
	for i := range p {
		p[i] = -1
	}
	for i, v := range a {
		l, h := 0, len(tails)
		for l < h {
			m := (l + h) / 2
			if a[tails[m]] < v {
				l = m + 1
			} else {
				h = m
			}
		}
		if l > 0 {
			p[i] = tails[l-1]
		}
		if l == len(tails) {
			tails = append(tails, i)
		} else {
			tails[l] = i
		}
	}
	r := []float64{}
	if len(tails) == 0 {
		return r
	}
	for i := tails[len(tails)-1]; i != -1; i = p[i] {
		r = append(r, a[i])
	}
	for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return r
}
