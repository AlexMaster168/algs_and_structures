package linear

type Stack[T any] struct{ items []T }

func (s *Stack[T]) Size() int          { return len(s.items) }
func (s *Stack[T]) IsEmpty() bool      { return len(s.items) == 0 }
func (s *Stack[T]) Push(v T) *Stack[T] { s.items = append(s.items, v); return s }
func (s *Stack[T]) Pop() (v T, ok bool) {
	if s.IsEmpty() {
		return
	}
	i := len(s.items) - 1
	v = s.items[i]
	s.items = s.items[:i]
	return v, true
}
func (s *Stack[T]) Peek() (v T, ok bool) {
	if s.IsEmpty() {
		return
	}
	return s.items[len(s.items)-1], true
}
func (s *Stack[T]) ToArray() []T {
	r := make([]T, len(s.items))
	for i, v := range s.items {
		r[len(r)-1-i] = v
	}
	return r
}
