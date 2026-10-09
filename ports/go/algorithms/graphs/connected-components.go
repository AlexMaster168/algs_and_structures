package graphs

import "algs/algorithms/sorting"

func ConnectedComponents(g AdjacencyList) [][]int {
	seen := make([]bool, len(g))
	out := [][]int{}
	for s := range g {
		if seen[s] {
			continue
		}
		stack, c := []int{s}, []int{}
		seen[s] = true
		for len(stack) > 0 {
			v := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			c = append(c, v)
			for _, w := range g[v] {
				if !seen[w] {
					seen[w] = true
					stack = append(stack, w)
				}
			}
		}
		out = append(out, sorting.QuickSort(c))
	}
	return out
}
