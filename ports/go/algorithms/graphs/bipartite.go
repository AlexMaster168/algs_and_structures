package graphs

func BipartiteColoring(g AdjacencyList) []int {
	colors := filled(len(g), -1)
	for s := range g {
		if colors[s] != -1 {
			continue
		}
		colors[s] = 0
		q := []int{s}
		for h := 0; h < len(q); h++ {
			v := q[h]
			for _, w := range g[v] {
				if colors[w] == -1 {
					colors[w] = 1 - colors[v]
					q = append(q, w)
				} else if colors[w] == colors[v] {
					return nil
				}
			}
		}
	}
	return colors
}
func IsBipartite(g AdjacencyList) bool { return BipartiteColoring(g) != nil }
