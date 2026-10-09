package dp

type Memoized[K comparable, R any] struct {
	Cache map[K]R
	fn    func(K) R
}

func Memoize[K comparable, R any](fn func(K) R) *Memoized[K, R] {
	return &Memoized[K, R]{Cache: map[K]R{}, fn: fn}
}
func (m *Memoized[K, R]) Call(k K) R {
	if r, ok := m.Cache[k]; ok {
		return r
	}
	r := m.fn(k)
	m.Cache[k] = r
	return r
}
