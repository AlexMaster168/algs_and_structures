package linear

type Deque[T any] struct {
	buffer       []T
	head, length int
}

func NewDeque[T any](capacities ...int) *Deque[T] {
	n := 8
	if len(capacities) > 0 {
		n = max(1, capacities[0])
	}
	return &Deque[T]{buffer: make([]T, n)}
}
func (d *Deque[T]) Size() int     { return d.length }
func (d *Deque[T]) IsEmpty() bool { return d.length == 0 }
func (d *Deque[T]) grow() {
	if d.length < len(d.buffer) {
		return
	}
	b := make([]T, max(1, len(d.buffer)*2))
	for i := 0; i < d.length; i++ {
		b[i] = d.buffer[(d.head+i)%len(d.buffer)]
	}
	d.buffer = b
	d.head = 0
}
func (d *Deque[T]) PushBack(v T) *Deque[T] {
	d.grow()
	d.buffer[(d.head+d.length)%len(d.buffer)] = v
	d.length++
	return d
}
func (d *Deque[T]) PushFront(v T) *Deque[T] {
	d.grow()
	d.head = (d.head - 1 + len(d.buffer)) % len(d.buffer)
	d.buffer[d.head] = v
	d.length++
	return d
}
func (d *Deque[T]) PopBack() (v T, ok bool) {
	if d.IsEmpty() {
		return
	}
	i := (d.head + d.length - 1) % len(d.buffer)
	v = d.buffer[i]
	var z T
	d.buffer[i] = z
	d.length--
	return v, true
}
func (d *Deque[T]) PopFront() (v T, ok bool) {
	if d.IsEmpty() {
		return
	}
	v = d.buffer[d.head]
	var z T
	d.buffer[d.head] = z
	d.head = (d.head + 1) % len(d.buffer)
	d.length--
	return v, true
}
func (d *Deque[T]) At(i int) (v T, ok bool) {
	if i < 0 {
		i += d.length
	}
	if i < 0 || i >= d.length {
		return
	}
	return d.buffer[(d.head+i)%len(d.buffer)], true
}
func (d *Deque[T]) PeekFront() (T, bool) { return d.At(0) }
func (d *Deque[T]) PeekBack() (T, bool)  { return d.At(-1) }
func (d *Deque[T]) ToArray() []T {
	r := make([]T, d.length)
	for i := range r {
		r[i], _ = d.At(i)
	}
	return r
}
