package searching

import (
	"algs/algorithms/sorting"
	"algs/shared"
	"math/rand"
)

func QuickSelect[T any](input []T, k int, cs ...shared.Comparator[T]) T {
	if k < 0 || k >= len(input) {
		panic("k out of bounds")
	}
	a := append([]T{}, input...)
	l, h := 0, len(a)-1
	c := shared.Compare(cs)
	for {
		p := l + rand.Intn(h-l+1)
		a[p], a[h] = a[h], a[p]
		p = sorting.LomutoPartition(a, l, h, c)
		if p == k {
			return a[p]
		}
		if p < k {
			l = p + 1
		} else {
			h = p - 1
		}
	}
}
func Median(a []float64) float64 {
	if len(a) == 0 {
		panic("empty median")
	}
	m := len(a) / 2
	if len(a)%2 == 1 {
		return QuickSelect(a, m)
	}
	return (QuickSelect(a, m-1) + QuickSelect(a, m)) / 2
}
