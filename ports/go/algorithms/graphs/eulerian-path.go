package graphs

func EulerianPathDirected(g AdjacencyList) []int {
	n := len(g)
	degree := make([]int, n)
	count := 0
	for _, ns := range g {
		count += len(ns)
		for _, w := range ns {
			degree[w]++
		}
	}
	if count == 0 {
		if n > 0 {
			return []int{0}
		}
		return []int{}
	}
	start := -1
	for v, ns := range g {
		if len(ns) > 0 {
			start = v
			break
		}
	}
	starts, ends := 0, 0
	for v, ns := range g {
		b := len(ns) - degree[v]
		if b == 1 {
			starts++
			start = v
		} else if b == -1 {
			ends++
		} else if b != 0 {
			return nil
		}
	}
	if !((starts == 0 && ends == 0) || (starts == 1 && ends == 1)) {
		return nil
	}
	next := make([]int, n)
	stack, path := []int{start}, []int{}
	for len(stack) > 0 {
		v := stack[len(stack)-1]
		if next[v] < len(g[v]) {
			stack = append(stack, g[v][next[v]])
			next[v]++
		} else {
			path = append(path, v)
			stack = stack[:len(stack)-1]
		}
	}
	if len(path) != count+1 {
		return nil
	}
	reverse(path)
	return path
}
