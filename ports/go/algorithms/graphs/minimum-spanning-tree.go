package graphs

import (
	"algs/algorithms/sorting"
	ds "algs/data-structures/graphs"
	"algs/data-structures/heaps"
)

type SpanningTree struct {
	Weight float64
	Edges  []Edge
}

func edgeCompare(a, b Edge) int {
	if a.Weight < b.Weight {
		return -1
	}
	if a.Weight > b.Weight {
		return 1
	}
	return 0
}
func Kruskal(n int, edges []Edge) SpanningTree {
	sets := ds.NewDisjointSet(n)
	r := SpanningTree{Edges: []Edge{}}
	for _, e := range sorting.MergeSort(edges, edgeCompare) {
		if !sets.Union(e.From, e.To) {
			continue
		}
		r.Edges = append(r.Edges, e)
		r.Weight += e.Weight
		if len(r.Edges) == n-1 {
			break
		}
	}
	return r
}
func Prim(g WeightedAdjacencyList, starts ...int) SpanningTree {
	r := SpanningTree{Edges: []Edge{}}
	if len(g) == 0 {
		return r
	}
	s := 0
	if len(starts) > 0 {
		s = starts[0]
	}
	seen := make([]bool, len(g))
	h := heaps.NewBinaryHeap(edgeCompare)
	visit := func(v int) {
		seen[v] = true
		for _, w := range g[v] {
			if !seen[w.To] {
				h.Push(Edge{v, w.To, w.Weight})
			}
		}
	}
	visit(s)
	for !h.IsEmpty() && len(r.Edges) < len(g)-1 {
		e, _ := h.Pop()
		if seen[e.To] {
			continue
		}
		r.Edges = append(r.Edges, e)
		r.Weight += e.Weight
		visit(e.To)
	}
	return r
}
