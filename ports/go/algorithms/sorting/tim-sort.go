package sorting

import "algs/shared"

func TimSort[T any](input []T, cs ...shared.Comparator[T]) []T {
	a := append([]T{}, input...)
	c := shared.Compare(cs)
	n, r := len(a), 0
	for n >= 32 {
		r |= n & 1
		n >>= 1
	}
	run := n + r
	if run == 0 {
		return a
	}
	for s := 0; s < len(a); s += run {
		InsertionSortRange(a, s, min(s+run-1, len(a)-1), c)
	}
	for w := run; w < len(a); w *= 2 {
		for l := 0; l < len(a); l += 2 * w {
			m, e := min(l+w, len(a)), min(l+2*w, len(a))
			if m < e {
				copy(a[l:e], Merge(a[l:m], a[m:e], c))
			}
		}
	}
	return a
}
