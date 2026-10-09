package graphs

func DFS(g AdjacencyList, s int) []int {
	visited := make([]bool, len(g))
	r, stack := []int{}, []int{s}
	for len(stack) > 0 {
		v := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if visited[v] {
			continue
		}
		visited[v] = true
		r = append(r, v)
		for i := len(g[v]) - 1; i >= 0; i-- {
			if !visited[g[v][i]] {
				stack = append(stack, g[v][i])
			}
		}
	}
	return r
}
func DFSRecursive(g AdjacencyList, s int) []int {
	visited := make([]bool, len(g))
	r := []int{}
	var f func(int)
	f = func(v int) {
		visited[v] = true
		r = append(r, v)
		for _, w := range g[v] {
			if !visited[w] {
				f(w)
			}
		}
	}
	f(s)
	return r
}
func HasPath(g AdjacencyList, s, t int) bool {
	for _, v := range DFS(g, s) {
		if v == t {
			return true
		}
	}
	return false
}
