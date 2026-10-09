package searching

func LinearSearch[T comparable](a []T, t T) int {
	for i, v := range a {
		if v == t {
			return i
		}
	}
	return -1
}
func LinearSearchAll[T any](a []T, p func(T, int) bool) []int {
	r := []int{}
	for i, v := range a {
		if p(v, i) {
			r = append(r, i)
		}
	}
	return r
}
