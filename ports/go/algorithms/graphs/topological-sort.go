package graphs

func TopologicalSortKahn(g AdjacencyList) []int {
	degree := make([]int, len(g))
	for _, ns := range g {
		for _, w := range ns {
			degree[w]++
		}
	}
	q := []int{}
	for v, d := range degree {
		if d == 0 {
			q = append(q, v)
		}
	}
	for h := 0; h < len(q); h++ {
		for _, w := range g[q[h]] {
			degree[w]--
			if degree[w] == 0 {
				q = append(q, w)
			}
		}
	}
	if len(q) != len(g) {
		return nil
	}
	return q
}
func TopologicalSortDFS(g AdjacencyList) []int {
	state := make([]int, len(g))
	r := []int{}
	var visit func(int) bool
	visit = func(v int) bool {
		state[v] = 1
		for _, w := range g[v] {
			if state[w] == 1 {
				return false
			}
			if state[w] == 0 && !visit(w) {
				return false
			}
		}
		state[v] = 2
		r = append(r, v)
		return true
	}
	for v := range g {
		if state[v] == 0 && !visit(v) {
			return nil
		}
	}
	reverse(r)
	return r
}
