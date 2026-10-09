package sorting

import "algs/shared"

func InsertionSortRange[T any](a []T, left, right int, c shared.Comparator[T]) {
	for i := left + 1; i <= right; i++ {
		v := a[i]
		j := i - 1
		for j >= left && c(a[j], v) > 0 {
			a[j+1] = a[j]
			j--
		}
		a[j+1] = v
	}
}
func InsertionSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	InsertionSortRange(a, 0, len(a)-1, shared.Compare(cs))
	return a
}
