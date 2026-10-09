package graphs

import "math"

func EdmondsKarp(capacity [][]float64, s, t int) float64 {
	if s == t {
		panic("source equals sink")
	}
	n := len(capacity)
	r := make([][]float64, n)
	for i := range r {
		r[i] = append([]float64{}, capacity[i]...)
	}
	flow := 0.0
	for {
		p := filled(n, -1)
		p[s] = s
		q := []int{s}
		for h := 0; h < len(q) && p[t] == -1; h++ {
			v := q[h]
			for w := 0; w < n; w++ {
				if p[w] == -1 && r[v][w] > 0 {
					p[w] = v
					q = append(q, w)
				}
			}
		}
		if p[t] == -1 {
			return flow
		}
		b := math.Inf(1)
		for v := t; v != s; v = p[v] {
			b = min(b, r[p[v]][v])
		}
		for v := t; v != s; v = p[v] {
			r[p[v]][v] -= b
			r[v][p[v]] += b
		}
		flow += b
	}
}
