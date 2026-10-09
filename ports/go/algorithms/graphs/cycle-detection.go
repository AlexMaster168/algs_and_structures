package graphs

import ds "algs/data-structures/graphs"

func HasCycleDirected(g AdjacencyList) bool { return TopologicalSortKahn(g) == nil }
func HasCycleUndirected(n int, edges [][2]int) bool {
	d := ds.NewDisjointSet(n)
	for _, e := range edges {
		if !d.Union(e[0], e[1]) {
			return true
		}
	}
	return false
}
