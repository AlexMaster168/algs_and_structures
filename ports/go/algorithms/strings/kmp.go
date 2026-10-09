package strings

import "algs/shared"

func PrefixFunction(s string) []int {
	a := shared.Units(s)
	p := make([]int, len(a))
	for i := 1; i < len(a); i++ {
		k := p[i-1]
		for k > 0 && a[i] != a[k] {
			k = p[k-1]
		}
		if a[i] == a[k] {
			k++
		}
		p[i] = k
	}
	return p
}
func KMPSearch(text, pattern string) []int {
	r := []int{}
	t, p := shared.Units(text), shared.Units(pattern)
	if len(p) == 0 {
		return r
	}
	pi := PrefixFunction(pattern)
	k := 0
	for i, c := range t {
		for k > 0 && c != p[k] {
			k = pi[k-1]
		}
		if c == p[k] {
			k++
		}
		if k == len(p) {
			r = append(r, i-k+1)
			k = pi[k-1]
		}
	}
	return r
}
