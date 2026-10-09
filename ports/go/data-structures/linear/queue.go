package linear

type Queue[T any] struct {
	items []T
	head  int
}

func (q *Queue[T]) Size() int             { return len(q.items) - q.head }
func (q *Queue[T]) IsEmpty() bool         { return q.Size() == 0 }
func (q *Queue[T]) Enqueue(v T) *Queue[T] { q.items = append(q.items, v); return q }
func (q *Queue[T]) Dequeue() (v T, ok bool) {
	if q.IsEmpty() {
		return
	}
	v = q.items[q.head]
	var z T
	q.items[q.head] = z
	q.head++
	if q.head*2 >= len(q.items) {
		q.items = append([]T{}, q.items[q.head:]...)
		q.head = 0
	}
	return v, true
}
func (q *Queue[T]) Peek() (v T, ok bool) {
	if q.IsEmpty() {
		return
	}
	return q.items[q.head], true
}
func (q *Queue[T]) ToArray() []T { return append([]T{}, q.items[q.head:]...) }
