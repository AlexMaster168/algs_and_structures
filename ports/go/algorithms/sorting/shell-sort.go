package sorting

import "algs/shared"

func ShellSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	gap := 1
	for gap < len(a)/3 {
		gap = gap*3 + 1
	}
	for ; gap >= 1; gap = (gap - 1) / 3 {
		for i := gap; i < len(a); i++ {
			v := a[i]
			j := i
			for j >= gap && c(a[j-gap], v) > 0 {
				a[j] = a[j-gap]
				j -= gap
			}
			a[j] = v
		}
	}
	return a
}
