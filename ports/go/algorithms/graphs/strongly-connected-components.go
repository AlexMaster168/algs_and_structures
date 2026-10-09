package graphs

import "algs/algorithms/sorting"

func TarjanSCC(g AdjacencyList) [][]int {
	index, low := filled(len(g), -1), make([]int, len(g))
	on := make([]bool, len(g))
	stack := []int{}
	r := [][]int{}
	counter := 0
	var f func(int)
	f = func(v int) {
		index[v], low[v] = counter, counter
		counter++
		stack = append(stack, v)
		on[v] = true
		for _, w := range g[v] {
			if index[w] == -1 {
				f(w)
				low[v] = min(low[v], low[w])
			} else if on[w] {
				low[v] = min(low[v], index[w])
			}
		}
		if low[v] != index[v] {
			return
		}
		c := []int{}
		for {
			w := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			on[w] = false
			c = append(c, w)
			if w == v {
				break
			}
		}
		r = append(r, sorting.QuickSort(c))
	}
	for v := range g {
		if index[v] == -1 {
			f(v)
		}
	}
	return r
}
func KosarajuSCC(g AdjacencyList) [][]int {
	n := len(g)
	rev := make([][]int, n)
	for v, ns := range g {
		for _, w := range ns {
			rev[w] = append(rev[w], v)
		}
	}
	seen := make([]bool, n)
	finish := []int{}
	var fill func(int)
	fill = func(v int) {
		seen[v] = true
		for _, w := range g[v] {
			if !seen[w] {
				fill(w)
			}
		}
		finish = append(finish, v)
	}
	for v := range g {
		if !seen[v] {
			fill(v)
		}
	}
	seen = make([]bool, n)
	r := [][]int{}
	var collect func(int, *[]int)
	collect = func(v int, c *[]int) {
		seen[v] = true
		*c = append(*c, v)
		for _, w := range rev[v] {
			if !seen[w] {
				collect(w, c)
			}
		}
	}
	for i := len(finish) - 1; i >= 0; i-- {
		v := finish[i]
		if seen[v] {
			continue
		}
		c := []int{}
		collect(v, &c)
		r = append(r, sorting.QuickSort(c))
	}
	return r
}
