package sorting

import "algs/shared"

func Merge[T any](a, b []T, cs ...shared.Comparator[T]) []T {
	c := shared.Compare(cs)
	r := make([]T, 0, len(a)+len(b))
	i, j := 0, 0
	for i < len(a) && j < len(b) {
		if c(a[i], b[j]) <= 0 {
			r = append(r, a[i])
			i++
		} else {
			r = append(r, b[j])
			j++
		}
	}
	r = append(r, a[i:]...)
	return append(r, b[j:]...)
}
func MergeSort[T any](a []T, cs ...shared.Comparator[T]) []T {
	if len(a) < 2 {
		return append([]T{}, a...)
	}
	m := len(a) / 2
	return Merge(MergeSort(a[:m], cs...), MergeSort(a[m:], cs...), cs...)
}
func BottomUpMergeSort[T any](a []T, cs ...shared.Comparator[T]) []T {
	s := append([]T{}, a...)
	t := make([]T, len(a))
	for w := 1; w < len(a); w *= 2 {
		for l := 0; l < len(a); l += 2 * w {
			m, r := min(l+w, len(a)), min(l+2*w, len(a))
			copy(t[l:r], Merge(s[l:m], s[m:r], cs...))
		}
		s, t = t, s
	}
	return s
}
