package linear

type CircularBuffer[T any] struct {
	Capacity      int
	buffer        []T
	start, length int
}

func NewCircularBuffer[T any](n int) *CircularBuffer[T] {
	if n <= 0 {
		panic("invalid capacity")
	}
	return &CircularBuffer[T]{Capacity: n, buffer: make([]T, n)}
}
func (b *CircularBuffer[T]) Size() int     { return b.length }
func (b *CircularBuffer[T]) IsFull() bool  { return b.length == b.Capacity }
func (b *CircularBuffer[T]) IsEmpty() bool { return b.length == 0 }
func (b *CircularBuffer[T]) Push(v T) (old T, overwritten bool) {
	if b.IsFull() {
		old = b.buffer[b.start]
		b.buffer[b.start] = v
		b.start = (b.start + 1) % b.Capacity
		return old, true
	}
	b.buffer[(b.start+b.length)%b.Capacity] = v
	b.length++
	return
}
func (b *CircularBuffer[T]) Shift() (v T, ok bool) {
	if b.IsEmpty() {
		return
	}
	v = b.buffer[b.start]
	var z T
	b.buffer[b.start] = z
	b.start = (b.start + 1) % b.Capacity
	b.length--
	return v, true
}
func (b *CircularBuffer[T]) ToArray() []T {
	r := make([]T, b.length)
	for i := range r {
		r[i] = b.buffer[(b.start+i)%b.Capacity]
	}
	return r
}
