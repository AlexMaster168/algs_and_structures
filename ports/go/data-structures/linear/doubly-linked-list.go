package linear

import "reflect"

type DoublyLinkedListNode[T any] struct {
	Value      T
	Prev, Next *DoublyLinkedListNode[T]
}
type DoublyLinkedList[T any] struct {
	head, tail *DoublyLinkedListNode[T]
	length     int
}

func DoublyLinkedListFrom[T any](a []T) *DoublyLinkedList[T] {
	l := &DoublyLinkedList[T]{}
	for _, v := range a {
		l.PushBack(v)
	}
	return l
}
func (l *DoublyLinkedList[T]) Size() int { return l.length }
func (l *DoublyLinkedList[T]) First() (v T, ok bool) {
	if l.head == nil {
		return
	}
	return l.head.Value, true
}
func (l *DoublyLinkedList[T]) Last() (v T, ok bool) {
	if l.tail == nil {
		return
	}
	return l.tail.Value, true
}
func (l *DoublyLinkedList[T]) PushBack(v T) *DoublyLinkedListNode[T] {
	n := &DoublyLinkedListNode[T]{Value: v, Prev: l.tail}
	if l.tail == nil {
		l.head = n
	} else {
		l.tail.Next = n
	}
	l.tail = n
	l.length++
	return n
}
func (l *DoublyLinkedList[T]) PushFront(v T) *DoublyLinkedListNode[T] {
	n := &DoublyLinkedListNode[T]{Value: v, Next: l.head}
	if l.head == nil {
		l.tail = n
	} else {
		l.head.Prev = n
	}
	l.head = n
	l.length++
	return n
}
func (l *DoublyLinkedList[T]) Unlink(n *DoublyLinkedListNode[T]) {
	if n.Prev == nil {
		l.head = n.Next
	} else {
		n.Prev.Next = n.Next
	}
	if n.Next == nil {
		l.tail = n.Prev
	} else {
		n.Next.Prev = n.Prev
	}
	n.Prev = nil
	n.Next = nil
	l.length--
}
func (l *DoublyLinkedList[T]) PopBack() (v T, ok bool) {
	if l.tail == nil {
		return
	}
	n := l.tail
	l.Unlink(n)
	return n.Value, true
}
func (l *DoublyLinkedList[T]) PopFront() (v T, ok bool) {
	if l.head == nil {
		return
	}
	n := l.head
	l.Unlink(n)
	return n.Value, true
}
func (l *DoublyLinkedList[T]) Remove(v T) bool {
	for n := l.head; n != nil; n = n.Next {
		if reflect.DeepEqual(v, n.Value) {
			l.Unlink(n)
			return true
		}
	}
	return false
}
func (l *DoublyLinkedList[T]) ToArray() []T {
	r := []T{}
	for n := l.head; n != nil; n = n.Next {
		r = append(r, n.Value)
	}
	return r
}
func (l *DoublyLinkedList[T]) Reversed() []T {
	r := []T{}
	for n := l.tail; n != nil; n = n.Prev {
		r = append(r, n.Value)
	}
	return r
}
