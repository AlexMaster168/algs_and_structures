package sorting

import (
	"algs/shared"
	"math/rand"
)

func Partition3[T any](a []T, low, high int, c shared.Comparator[T]) (int, int) {
	p := a[low+rand.Intn(high-low+1)]
	lt, gt, i := low, high, low
	for i <= gt {
		v := c(a[i], p)
		if v < 0 {
			a[lt], a[i] = a[i], a[lt]
			lt++
			i++
		} else if v > 0 {
			a[i], a[gt] = a[gt], a[i]
			gt--
		} else {
			i++
		}
	}
	return lt, gt
}
func LomutoPartition[T any](a []T, low, high int, c shared.Comparator[T]) int {
	p, b := a[high], low
	for i := low; i < high; i++ {
		if c(a[i], p) < 0 {
			a[i], a[b] = a[b], a[i]
			b++
		}
	}
	a[b], a[high] = a[high], a[b]
	return b
}
func QuickSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	stack := [][2]int{{0, len(a) - 1}}
	for len(stack) > 0 {
		v := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if v[0] >= v[1] {
			continue
		}
		l, r := Partition3(a, v[0], v[1], c)
		stack = append(stack, [2]int{v[0], l - 1}, [2]int{r + 1, v[1]})
	}
	return a
}
func QuickSortFunctional[T any](a []T, cs ...shared.Comparator[T]) []T {
	if len(a) < 2 {
		return append([]T{}, a...)
	}
	c := shared.Compare(cs)
	l, r := []T{}, []T{}
	for _, v := range a[1:] {
		if c(v, a[0]) < 0 {
			l = append(l, v)
		} else {
			r = append(r, v)
		}
	}
	out := append(QuickSortFunctional(l, c), a[0])
	return append(out, QuickSortFunctional(r, c)...)
}
