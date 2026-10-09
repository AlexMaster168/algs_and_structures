package sorting

import "algs/shared"

func BubbleSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	for end := len(a) - 1; end > 0; end-- {
		swapped := false
		for i := 0; i < end; i++ {
			if c(a[i], a[i+1]) > 0 {
				a[i], a[i+1] = a[i+1], a[i]
				swapped = true
			}
		}
		if !swapped {
			break
		}
	}
	return a
}
