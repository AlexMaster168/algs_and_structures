package graphs

import "math"

type BellmanFordResult struct {
	Distance         []float64
	Parent           []int
	HasNegativeCycle bool
}

func BellmanFord(n int, edges []Edge, s int) BellmanFordResult {
	d := make([]float64, n)
	for i := range d {
		d[i] = math.Inf(1)
	}
	p := filled(n, -1)
	d[s] = 0
	for i := 0; i < n-1; i++ {
		changed := false
		for _, e := range edges {
			if d[e.From]+e.Weight < d[e.To] {
				d[e.To] = d[e.From] + e.Weight
				p[e.To] = e.From
				changed = true
			}
		}
		if !changed {
			break
		}
	}
	negative := false
	for _, e := range edges {
		if d[e.From]+e.Weight < d[e.To] {
			negative = true
		}
	}
	return BellmanFordResult{d, p, negative}
}
