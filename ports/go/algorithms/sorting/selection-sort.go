package sorting

import "algs/shared"

func SelectionSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	for i := 0; i < len(a)-1; i++ {
		m := i
		for j := i + 1; j < len(a); j++ {
			if c(a[j], a[m]) < 0 {
				m = j
			}
		}
		a[i], a[m] = a[m], a[i]
	}
	return a
}
