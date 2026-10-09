package techniques

func MaxSumWindow(a []float64, n int) float64 {
	if n <= 0 || n > len(a) {
		panic("invalid window")
	}
	s := 0.0
	for _, v := range a[:n] {
		s += v
	}
	b := s
	for i := n; i < len(a); i++ {
		s += a[i] - a[i-n]
		b = max(b, s)
	}
	return b
}
func SlidingWindowMaximum(a []float64, n int) []float64 {
	q := []int{}
	r := []float64{}
	for i, v := range a {
		for len(q) > 0 && q[0] <= i-n {
			q = q[1:]
		}
		for len(q) > 0 && a[q[len(q)-1]] <= v {
			q = q[:len(q)-1]
		}
		q = append(q, i)
		if i >= n-1 {
			r = append(r, a[q[0]])
		}
	}
	return r
}
func LongestUniqueSubstring(s string) string {
	seen := map[byte]int{}
	start, best, n := 0, 0, 0
	for i := 0; i < len(s); i++ {
		if j, ok := seen[s[i]]; ok && j >= start {
			start = j + 1
		}
		seen[s[i]] = i
		if i-start+1 > n {
			best, n = start, i-start+1
		}
	}
	return s[best : best+n]
}
func MinWindowSubstring(s, t string) string {
	if t == "" {
		return ""
	}
	need := map[byte]int{}
	for i := range t {
		need[t[i]]++
	}
	missing, b, n, l := len(t), 0, len(s)+1, 0
	for r := 0; r < len(s); r++ {
		c := s[r]
		if need[c] > 0 {
			missing--
		}
		need[c]--
		for missing == 0 {
			if r-l+1 < n {
				b, n = l, r-l+1
			}
			c = s[l]
			l++
			need[c]++
			if need[c] > 0 {
				missing++
			}
		}
	}
	if n > len(s) {
		return ""
	}
	return s[b : b+n]
}
