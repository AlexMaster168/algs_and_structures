package graphs

import (
	"algs/data-structures/heaps"
	"math"
)

type ShortestPaths struct {
	Distance []float64
	Parent   []int
}
type distanceEntry struct {
	vertex   int
	distance float64
}

func Dijkstra(g WeightedAdjacencyList, s int) ShortestPaths {
	d := make([]float64, len(g))
	for i := range d {
		d[i] = math.Inf(1)
	}
	p := filled(len(g), -1)
	h := heaps.NewBinaryHeap(func(a, b distanceEntry) int {
		if a.distance < b.distance {
			return -1
		}
		if a.distance > b.distance {
			return 1
		}
		return 0
	})
	d[s] = 0
	h.Push(distanceEntry{s, 0})
	for !h.IsEmpty() {
		e, _ := h.Pop()
		if e.distance > d[e.vertex] {
			continue
		}
		for _, w := range g[e.vertex] {
			if w.Weight < 0 {
				panic("negative dijkstra weight")
			}
			c := e.distance + w.Weight
			if c < d[w.To] {
				d[w.To] = c
				p[w.To] = e.vertex
				h.Push(distanceEntry{w.To, c})
			}
		}
	}
	return ShortestPaths{d, p}
}

type DijkstraPathResult struct {
	Distance float64
	Path     []int
}

func DijkstraPath(g WeightedAdjacencyList, s, t int) *DijkstraPathResult {
	r := Dijkstra(g, s)
	if math.IsInf(r.Distance[t], 1) {
		return nil
	}
	return &DijkstraPathResult{r.Distance[t], ReconstructPath(r.Parent, t)}
}
