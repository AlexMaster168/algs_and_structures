package searching

import "algs/shared"

func ExponentialSearch[T any](a []T, t T, cs ...shared.Comparator[T]) int {
	if len(a) == 0 {
		return -1
	}
	c := shared.Compare(cs)
	if c(a[0], t) == 0 {
		return 0
	}
	b := 1
	for b < len(a) && c(a[b], t) < 0 {
		b *= 2
	}
	return BinarySearch(a, t, c, b/2, min(b, len(a)-1))
}
