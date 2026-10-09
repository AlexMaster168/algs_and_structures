package backtracking

import "sort"

func Permutations[T any](items []T) [][]T {
	result := [][]T{}
	current := []T{}
	used := make([]bool, len(items))
	var build func()
	build = func() {
		if len(current) == len(items) {
			result = append(result, append([]T{}, current...))
			return
		}
		for i, item := range items {
			if used[i] {
				continue
			}
			used[i] = true
			current = append(current, item)
			build()
			current = current[:len(current)-1]
			used[i] = false
		}
	}
	build()
	return result
}
func Combinations[T any](items []T, size int) [][]T {
	result := [][]T{}
	current := []T{}
	var build func(int)
	build = func(start int) {
		if len(current) == size {
			result = append(result, append([]T{}, current...))
			return
		}
		for i := start; i <= len(items)-(size-len(current)); i++ {
			current = append(current, items[i])
			build(i + 1)
			current = current[:len(current)-1]
		}
	}
	if size >= 0 {
		build(0)
	}
	return result
}
func Subsets[T any](items []T) [][]T {
	result := [][]T{}
	current := []T{}
	var build func(int)
	build = func(index int) {
		if index == len(items) {
			result = append(result, append([]T{}, current...))
			return
		}
		build(index + 1)
		current = append(current, items[index])
		build(index + 1)
		current = current[:len(current)-1]
	}
	build(0)
	return result
}
func CombinationSum(candidates []int, target int) [][]int {
	unique := map[int]bool{}
	sorted := []int{}
	for _, v := range candidates {
		if v <= 0 {
			panic("candidates must be positive")
		}
		if !unique[v] {
			unique[v] = true
			sorted = append(sorted, v)
		}
	}
	sort.Ints(sorted)
	result := [][]int{}
	current := []int{}
	var build func(int, int)
	build = func(start, remaining int) {
		if remaining == 0 {
			result = append(result, append([]int{}, current...))
			return
		}
		for i := start; i < len(sorted) && sorted[i] <= remaining; i++ {
			current = append(current, sorted[i])
			build(i, remaining-sorted[i])
			current = current[:len(current)-1]
		}
	}
	build(0, target)
	return result
}
