package linear

import "reflect"

type LinkedListNode[T any] struct {
	Value T
	Next  *LinkedListNode[T]
}
type LinkedList[T any] struct {
	head, tail *LinkedListNode[T]
	length     int
}

func LinkedListFrom[T any](a []T) *LinkedList[T] {
	l := &LinkedList[T]{}
	for _, v := range a {
		l.Append(v)
	}
	return l
}
func (l *LinkedList[T]) Size() int { return l.length }
func (l *LinkedList[T]) First() (v T, ok bool) {
	if l.head == nil {
		return
	}
	return l.head.Value, true
}
func (l *LinkedList[T]) Last() (v T, ok bool) {
	if l.tail == nil {
		return
	}
	return l.tail.Value, true
}
func (l *LinkedList[T]) Append(v T) *LinkedList[T] {
	n := &LinkedListNode[T]{Value: v}
	if l.tail == nil {
		l.head = n
	} else {
		l.tail.Next = n
	}
	l.tail = n
	l.length++
	return l
}
func (l *LinkedList[T]) Prepend(v T) *LinkedList[T] {
	n := &LinkedListNode[T]{v, l.head}
	l.head = n
	if l.tail == nil {
		l.tail = n
	}
	l.length++
	return l
}
func (l *LinkedList[T]) nodeAt(i int) *LinkedListNode[T] {
	n := l.head
	for j := 0; j < i; j++ {
		n = n.Next
	}
	return n
}
func (l *LinkedList[T]) InsertAt(i int, v T) *LinkedList[T] {
	if i < 0 || i > l.length {
		panic("index out of bounds")
	}
	if i == 0 {
		return l.Prepend(v)
	}
	if i == l.length {
		return l.Append(v)
	}
	p := l.nodeAt(i - 1)
	p.Next = &LinkedListNode[T]{v, p.Next}
	l.length++
	return l
}
func (l *LinkedList[T]) Get(i int) (v T, ok bool) {
	if i < 0 || i >= l.length {
		return
	}
	return l.nodeAt(i).Value, true
}
func (l *LinkedList[T]) IndexOf(v T) int {
	i := 0
	for n := l.head; n != nil; n = n.Next {
		if reflect.DeepEqual(n.Value, v) {
			return i
		}
		i++
	}
	return -1
}
func (l *LinkedList[T]) Find(p func(T) bool) (v T, ok bool) {
	for n := l.head; n != nil; n = n.Next {
		if p(n.Value) {
			return n.Value, true
		}
	}
	return
}
func (l *LinkedList[T]) RemoveAt(i int) (v T, ok bool) {
	if i < 0 || i >= l.length {
		return
	}
	var n *LinkedListNode[T]
	if i == 0 {
		n = l.head
		l.head = n.Next
		if l.head == nil {
			l.tail = nil
		}
	} else {
		p := l.nodeAt(i - 1)
		n = p.Next
		p.Next = n.Next
		if n == l.tail {
			l.tail = p
		}
	}
	l.length--
	return n.Value, true
}
func (l *LinkedList[T]) Remove(v T) bool {
	i := l.IndexOf(v)
	if i < 0 {
		return false
	}
	l.RemoveAt(i)
	return true
}
func (l *LinkedList[T]) Reverse() *LinkedList[T] {
	var p *LinkedListNode[T]
	n := l.head
	l.tail = n
	for n != nil {
		next := n.Next
		n.Next = p
		p = n
		n = next
	}
	l.head = p
	return l
}
func (l *LinkedList[T]) ToArray() []T {
	r := []T{}
	for n := l.head; n != nil; n = n.Next {
		r = append(r, n.Value)
	}
	return r
}
