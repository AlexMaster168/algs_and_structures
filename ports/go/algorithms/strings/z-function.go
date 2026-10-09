package strings

import "algs/shared"

func ZFunction(s string) []int {
	a := shared.Units(s)
	z := make([]int, len(a))
	if len(a) > 0 {
		z[0] = len(a)
	}
	l, r := 0, 0
	for i := 1; i < len(a); i++ {
		if i < r {
			z[i] = min(r-i, z[i-l])
		}
		for i+z[i] < len(a) && a[z[i]] == a[i+z[i]] {
			z[i]++
		}
		if i+z[i] > r {
			l, r = i, i+z[i]
		}
	}
	return z
}
func ZSearch(t, p string) []int {
	out := []int{}
	n := len(shared.Units(p))
	if n == 0 {
		return out
	}
	z := ZFunction(p + "\x00" + t)
	for i := n + 1; i < len(z); i++ {
		if z[i] >= n {
			out = append(out, i-n-1)
		}
	}
	return out
}
