package sorting

import "algs/shared"

func HeapSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	sift := func(root, end int) {
		for {
			l, r, b := root*2+1, root*2+2, root
			if l < end && c(a[l], a[b]) > 0 {
				b = l
			}
			if r < end && c(a[r], a[b]) > 0 {
				b = r
			}
			if b == root {
				return
			}
			a[root], a[b] = a[b], a[root]
			root = b
		}
	}
	for i := len(a)/2 - 1; i >= 0; i-- {
		sift(i, len(a))
	}
	for e := len(a) - 1; e > 0; e-- {
		a[0], a[e] = a[e], a[0]
		sift(0, e)
	}
	return a
}
