package sorting

import "algs/shared"

func CocktailShakerSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	start, end := 0, len(a)-1
	swapped := true
	swap := func(i int) {
		if c(a[i], a[i+1]) > 0 {
			a[i], a[i+1] = a[i+1], a[i]
			swapped = true
		}
	}
	for swapped && start < end {
		swapped = false
		for i := start; i < end; i++ {
			swap(i)
		}
		end--
		if !swapped {
			break
		}
		swapped = false
		for i := end - 1; i >= start; i-- {
			swap(i)
		}
		start++
	}
	return a
}
