package strings

import "algs/shared"

func RabinKarp(text, pattern string) []int {
	t, p := shared.Units(text), shared.Units(pattern)
	m := len(p)
	r := []int{}
	if m == 0 || m > len(t) {
		return r
	}
	const mod int64 = 1000000007
	power, ph, wh := int64(1), int64(0), int64(0)
	for i := 1; i < m; i++ {
		power = power * 256 % mod
	}
	for i := 0; i < m; i++ {
		ph = (ph*256 + int64(p[i])) % mod
		wh = (wh*256 + int64(t[i])) % mod
	}
	for s := 0; ; s++ {
		if ph == wh {
			equal := true
			for j := range p {
				if t[s+j] != p[j] {
					equal = false
					break
				}
			}
			if equal {
				r = append(r, s)
			}
		}
		if s+m >= len(t) {
			break
		}
		wh = (wh - int64(t[s])*power%mod + mod) % mod
		wh = (wh*256 + int64(t[s+m])) % mod
	}
	return r
}
