package trees

import "algs/shared"

type avlNode[T any] struct {
	value       T
	left, right *avlNode[T]
	height      int
}
type AVLTree[T any] struct {
	root    *avlNode[T]
	count   int
	compare shared.Comparator[T]
}

func NewAVLTree[T any](cs ...shared.Comparator[T]) *AVLTree[T] {
	return &AVLTree[T]{compare: shared.Compare(cs)}
}
func avlHeight[T any](n *avlNode[T]) int {
	if n == nil {
		return 0
	}
	return n.height
}
func avlRefresh[T any](n *avlNode[T]) { n.height = 1 + max(avlHeight(n.left), avlHeight(n.right)) }
func avlRight[T any](n *avlNode[T]) *avlNode[T] {
	p := n.left
	n.left = p.right
	p.right = n
	avlRefresh(n)
	avlRefresh(p)
	return p
}
func avlLeft[T any](n *avlNode[T]) *avlNode[T] {
	p := n.right
	n.right = p.left
	p.left = n
	avlRefresh(n)
	avlRefresh(p)
	return p
}
func avlBalance[T any](n *avlNode[T]) *avlNode[T] {
	avlRefresh(n)
	b := avlHeight(n.left) - avlHeight(n.right)
	if b > 1 {
		if avlHeight(n.left.left) < avlHeight(n.left.right) {
			n.left = avlLeft(n.left)
		}
		return avlRight(n)
	}
	if b < -1 {
		if avlHeight(n.right.left) > avlHeight(n.right.right) {
			n.right = avlRight(n.right)
		}
		return avlLeft(n)
	}
	return n
}
func (t *AVLTree[T]) Size() int   { return t.count }
func (t *AVLTree[T]) Height() int { return avlHeight(t.root) }
func (t *AVLTree[T]) Has(v T) bool {
	n := t.root
	for n != nil {
		o := t.compare(v, n.value)
		if o == 0 {
			return true
		}
		if o < 0 {
			n = n.left
		} else {
			n = n.right
		}
	}
	return false
}
func (t *AVLTree[T]) Insert(v T) bool {
	if t.Has(v) {
		return false
	}
	var f func(*avlNode[T]) *avlNode[T]
	f = func(n *avlNode[T]) *avlNode[T] {
		if n == nil {
			return &avlNode[T]{value: v, height: 1}
		}
		if t.compare(v, n.value) < 0 {
			n.left = f(n.left)
		} else {
			n.right = f(n.right)
		}
		return avlBalance(n)
	}
	t.root = f(t.root)
	t.count++
	return true
}
func (t *AVLTree[T]) Delete(v T) bool {
	if !t.Has(v) {
		return false
	}
	var f func(*avlNode[T], T) *avlNode[T]
	f = func(n *avlNode[T], v T) *avlNode[T] {
		o := t.compare(v, n.value)
		if o < 0 {
			n.left = f(n.left, v)
		} else if o > 0 {
			n.right = f(n.right, v)
		} else {
			if n.left == nil {
				return n.right
			}
			if n.right == nil {
				return n.left
			}
			s := n.right
			for s.left != nil {
				s = s.left
			}
			n.value = s.value
			n.right = f(n.right, s.value)
		}
		return avlBalance(n)
	}
	t.root = f(t.root, v)
	t.count--
	return true
}
func (t *AVLTree[T]) IsBalanced() bool {
	var f func(*avlNode[T]) bool
	f = func(n *avlNode[T]) bool {
		if n == nil {
			return true
		}
		b := avlHeight(n.left) - avlHeight(n.right)
		return b >= -1 && b <= 1 && f(n.left) && f(n.right)
	}
	return f(t.root)
}
func (t *AVLTree[T]) ToArray() []T {
	r := []T{}
	var f func(*avlNode[T])
	f = func(n *avlNode[T]) {
		if n == nil {
			return
		}
		f(n.left)
		r = append(r, n.value)
		f(n.right)
	}
	f(t.root)
	return r
}
