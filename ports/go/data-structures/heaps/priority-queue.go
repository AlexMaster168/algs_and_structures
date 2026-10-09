package heaps

type priorityEntry[T any] struct {
	value    T
	priority float64
	order    int
}
type PriorityQueue[T any] struct {
	heap    *BinaryHeap[priorityEntry[T]]
	counter int
}

func NewPriorityQueue[T any]() *PriorityQueue[T] {
	return &PriorityQueue[T]{heap: NewBinaryHeap(func(a, b priorityEntry[T]) int {
		if a.priority < b.priority {
			return -1
		}
		if a.priority > b.priority {
			return 1
		}
		return a.order - b.order
	})}
}
func (q *PriorityQueue[T]) Size() int     { return q.heap.Size() }
func (q *PriorityQueue[T]) IsEmpty() bool { return q.heap.IsEmpty() }
func (q *PriorityQueue[T]) Enqueue(v T, p float64) *PriorityQueue[T] {
	q.heap.Push(priorityEntry[T]{v, p, q.counter})
	q.counter++
	return q
}
func (q *PriorityQueue[T]) Dequeue() (v T, ok bool) { e, ok := q.heap.Pop(); return e.value, ok }
func (q *PriorityQueue[T]) Peek() (v T, ok bool)    { e, ok := q.heap.Peek(); return e.value, ok }
func (q *PriorityQueue[T]) PeekPriority() (float64, bool) {
	e, ok := q.heap.Peek()
	return e.priority, ok
}
