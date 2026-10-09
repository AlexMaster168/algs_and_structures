package trees

import "algs/shared"

type BSTNode[T any] struct {
	Value       T
	Left, Right *BSTNode[T]
}
type BinarySearchTree[T any] struct {
	root    *BSTNode[T]
	count   int
	compare shared.Comparator[T]
}

func NewBinarySearchTree[T any](cs ...shared.Comparator[T]) *BinarySearchTree[T] {
	return &BinarySearchTree[T]{compare: shared.Compare(cs)}
}
func BinarySearchTreeFrom[T any](a []T, cs ...shared.Comparator[T]) *BinarySearchTree[T] {
	t := NewBinarySearchTree(cs...)
	for _, v := range a {
		t.Insert(v)
	}
	return t
}
func (t *BinarySearchTree[T]) Size() int             { return t.count }
func (t *BinarySearchTree[T]) RootNode() *BSTNode[T] { return t.root }
func (t *BinarySearchTree[T]) Insert(v T) bool {
	p := &t.root
	for *p != nil {
		o := t.compare(v, (*p).Value)
		if o == 0 {
			return false
		}
		if o < 0 {
			p = &(*p).Left
		} else {
			p = &(*p).Right
		}
	}
	*p = &BSTNode[T]{Value: v}
	t.count++
	return true
}
func (t *BinarySearchTree[T]) Has(v T) bool {
	n := t.root
	for n != nil {
		o := t.compare(v, n.Value)
		if o == 0 {
			return true
		}
		if o < 0 {
			n = n.Left
		} else {
			n = n.Right
		}
	}
	return false
}
func (t *BinarySearchTree[T]) Delete(v T) bool {
	if !t.Has(v) {
		return false
	}
	var f func(*BSTNode[T], T) *BSTNode[T]
	f = func(n *BSTNode[T], v T) *BSTNode[T] {
		o := t.compare(v, n.Value)
		if o < 0 {
			n.Left = f(n.Left, v)
		} else if o > 0 {
			n.Right = f(n.Right, v)
		} else {
			if n.Left == nil {
				return n.Right
			}
			if n.Right == nil {
				return n.Left
			}
			s := n.Right
			for s.Left != nil {
				s = s.Left
			}
			n.Value = s.Value
			n.Right = f(n.Right, s.Value)
		}
		return n
	}
	t.root = f(t.root, v)
	t.count--
	return true
}
func (t *BinarySearchTree[T]) Min() (v T, ok bool) {
	n := t.root
	if n == nil {
		return
	}
	for n.Left != nil {
		n = n.Left
	}
	return n.Value, true
}
func (t *BinarySearchTree[T]) Max() (v T, ok bool) {
	n := t.root
	if n == nil {
		return
	}
	for n.Right != nil {
		n = n.Right
	}
	return n.Value, true
}
func (t *BinarySearchTree[T]) Floor(v T) (r T, ok bool) {
	for n := t.root; n != nil; {
		o := t.compare(v, n.Value)
		if o == 0 {
			return n.Value, true
		}
		if o < 0 {
			n = n.Left
		} else {
			r, ok = n.Value, true
			n = n.Right
		}
	}
	return
}
func (t *BinarySearchTree[T]) Ceil(v T) (r T, ok bool) {
	for n := t.root; n != nil; {
		o := t.compare(v, n.Value)
		if o == 0 {
			return n.Value, true
		}
		if o > 0 {
			n = n.Right
		} else {
			r, ok = n.Value, true
			n = n.Left
		}
	}
	return
}
func (t *BinarySearchTree[T]) Height() int {
	var f func(*BSTNode[T]) int
	f = func(n *BSTNode[T]) int {
		if n == nil {
			return 0
		}
		return 1 + max(f(n.Left), f(n.Right))
	}
	return f(t.root)
}
func (t *BinarySearchTree[T]) ToArray() []T {
	r := []T{}
	var f func(*BSTNode[T])
	f = func(n *BSTNode[T]) {
		if n == nil {
			return
		}
		f(n.Left)
		r = append(r, n.Value)
		f(n.Right)
	}
	f(t.root)
	return r
}
