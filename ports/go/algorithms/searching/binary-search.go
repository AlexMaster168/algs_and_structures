package searching

import "algs/shared"

func BinarySearch[T any](a []T, target T, c shared.Comparator[T], bounds ...int) int {
	if c == nil {
		c = shared.DefaultCompare[T]
	}
	l, h := 0, len(a)-1
	if len(bounds) > 0 {
		l = bounds[0]
	}
	if len(bounds) > 1 {
		h = bounds[1]
	}
	for l <= h {
		m := l + (h-l)/2
		o := c(a[m], target)
		if o == 0 {
			return m
		}
		if o < 0 {
			l = m + 1
		} else {
			h = m - 1
		}
	}
	return -1
}
func BinarySearchRecursive[T any](a []T, target T, c shared.Comparator[T], bounds ...int) int {
	if c == nil {
		c = shared.DefaultCompare[T]
	}
	l, h := 0, len(a)-1
	if len(bounds) > 0 {
		l = bounds[0]
	}
	if len(bounds) > 1 {
		h = bounds[1]
	}
	if l > h {
		return -1
	}
	m := l + (h-l)/2
	o := c(a[m], target)
	if o == 0 {
		return m
	}
	if o < 0 {
		return BinarySearchRecursive(a, target, c, m+1, h)
	}
	return BinarySearchRecursive(a, target, c, l, m-1)
}
func LowerBound[T any](a []T, t T, cs ...shared.Comparator[T]) int {
	c := shared.Compare(cs)
	l, h := 0, len(a)
	for l < h {
		m := (l + h) / 2
		if c(a[m], t) < 0 {
			l = m + 1
		} else {
			h = m
		}
	}
	return l
}
func UpperBound[T any](a []T, t T, cs ...shared.Comparator[T]) int {
	c := shared.Compare(cs)
	l, h := 0, len(a)
	for l < h {
		m := (l + h) / 2
		if c(a[m], t) <= 0 {
			l = m + 1
		} else {
			h = m
		}
	}
	return l
}
func FirstTrue(l, h int, p func(int) bool) int {
	for l < h {
		m := l + (h-l)/2
		if p(m) {
			h = m
		} else {
			l = m + 1
		}
	}
	return l
}
