package heaps

import "algs/shared"

type BinaryHeap[T any] struct {
	items   []T
	compare shared.Comparator[T]
}

func NewBinaryHeap[T any](c shared.Comparator[T], values ...T) *BinaryHeap[T] {
	if c == nil {
		c = shared.DefaultCompare[T]
	}
	h := &BinaryHeap[T]{append([]T{}, values...), c}
	for i := len(values)/2 - 1; i >= 0; i-- {
		h.down(i)
	}
	return h
}
func (h *BinaryHeap[T]) Size() int     { return len(h.items) }
func (h *BinaryHeap[T]) IsEmpty() bool { return h.Size() == 0 }
func (h *BinaryHeap[T]) Peek() (v T, ok bool) {
	if h.IsEmpty() {
		return
	}
	return h.items[0], true
}
func (h *BinaryHeap[T]) Push(values ...T) *BinaryHeap[T] {
	for _, v := range values {
		h.items = append(h.items, v)
		i := len(h.items) - 1
		for i > 0 {
			p := (i - 1) / 2
			if h.compare(h.items[i], h.items[p]) >= 0 {
				break
			}
			h.items[i], h.items[p] = h.items[p], h.items[i]
			i = p
		}
	}
	return h
}
func (h *BinaryHeap[T]) down(i int) {
	for {
		l, r, b := 2*i+1, 2*i+2, i
		if l < h.Size() && h.compare(h.items[l], h.items[b]) < 0 {
			b = l
		}
		if r < h.Size() && h.compare(h.items[r], h.items[b]) < 0 {
			b = r
		}
		if b == i {
			return
		}
		h.items[i], h.items[b] = h.items[b], h.items[i]
		i = b
	}
}
func (h *BinaryHeap[T]) Pop() (v T, ok bool) {
	if h.IsEmpty() {
		return
	}
	v = h.items[0]
	last := h.items[h.Size()-1]
	h.items = h.items[:h.Size()-1]
	if !h.IsEmpty() {
		h.items[0] = last
		h.down(0)
	}
	return v, true
}
func (h *BinaryHeap[T]) PushPop(v T) T {
	if h.IsEmpty() || h.compare(v, h.items[0]) <= 0 {
		return v
	}
	r := h.items[0]
	h.items[0] = v
	h.down(0)
	return r
}
func (h *BinaryHeap[T]) ToSortedArray() []T {
	c := NewBinaryHeap(h.compare, h.items...)
	r := []T{}
	for !c.IsEmpty() {
		v, _ := c.Pop()
		r = append(r, v)
	}
	return r
}
func (h *BinaryHeap[T]) ToArray() []T { return append([]T{}, h.items...) }

type MinHeap[T any] struct{ *BinaryHeap[T] }
type MaxHeap[T any] struct{ *BinaryHeap[T] }

func NewMinHeap[T any](a ...T) *MinHeap[T] {
	return &MinHeap[T]{NewBinaryHeap(shared.DefaultCompare[T], a...)}
}
func NewMaxHeap[T any](a ...T) *MaxHeap[T] {
	return &MaxHeap[T]{NewBinaryHeap(shared.ReverseCompare[T](), a...)}
}
