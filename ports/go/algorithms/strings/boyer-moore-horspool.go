package strings

import "algs/shared"

func BoyerMooreHorspool(text, pattern string) []int {
	t, p := shared.Units(text), shared.Units(pattern)
	m := len(p)
	r := []int{}
	if m == 0 || m > len(t) {
		return r
	}
	shift := map[uint16]int{}
	for i := 0; i < m-1; i++ {
		shift[p[i]] = m - 1 - i
	}
	for s := 0; s <= len(t)-m; {
		j := m - 1
		for j >= 0 && t[s+j] == p[j] {
			j--
		}
		if j < 0 {
			r = append(r, s)
		}
		d, ok := shift[t[s+m-1]]
		if !ok {
			d = m
		}
		s += d
	}
	return r
}
