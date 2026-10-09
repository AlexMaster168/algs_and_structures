package dp

import "algs/shared"

func EditDistance(source, target string) int {
	a, b := shared.Units(source), shared.Units(target)
	p := make([]int, len(b)+1)
	for j := range p {
		p[j] = j
	}
	for i, c := range a {
		r := make([]int, len(b)+1)
		r[0] = i + 1
		for j, d := range b {
			s := p[j]
			if c != d {
				s++
			}
			r[j+1] = min(p[j+1]+1, r[j]+1, s)
		}
		p = r
	}
	return p[len(b)]
}
