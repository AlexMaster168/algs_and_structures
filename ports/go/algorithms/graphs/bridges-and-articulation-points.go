package graphs

import "algs/algorithms/sorting"

type CutStructure struct {
	Bridges            [][2]int
	ArticulationPoints []int
}

func FindBridgesAndArticulationPoints(g AdjacencyList) CutStructure {
	entry, low := filled(len(g), -1), make([]int, len(g))
	cut := make([]bool, len(g))
	bridges := [][2]int{}
	timer := 0
	var visit func(int, int)
	visit = func(v, p int) {
		entry[v], low[v] = timer, timer
		timer++
		children := 0
		skipped := false
		for _, w := range g[v] {
			if w == p && !skipped {
				skipped = true
				continue
			}
			if entry[w] != -1 {
				low[v] = min(low[v], entry[w])
				continue
			}
			visit(w, v)
			children++
			low[v] = min(low[v], low[w])
			if low[w] > entry[v] {
				bridges = append(bridges, [2]int{min(v, w), max(v, w)})
			}
			if p != -1 && low[w] >= entry[v] {
				cut[v] = true
			}
		}
		if p == -1 && children > 1 {
			cut[v] = true
		}
	}
	for v := range g {
		if entry[v] == -1 {
			visit(v, -1)
		}
	}
	r := CutStructure{Bridges: sorting.QuickSort(bridges, func(a, b [2]int) int {
		if a[0] != b[0] {
			return a[0] - b[0]
		}
		return a[1] - b[1]
	}), ArticulationPoints: []int{}}
	for v, c := range cut {
		if c {
			r.ArticulationPoints = append(r.ArticulationPoints, v)
		}
	}
	return r
}
