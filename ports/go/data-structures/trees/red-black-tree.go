package trees

import "algs/shared"

type rbNode[T any] struct {
	value               T
	red                 bool
	left, right, parent *rbNode[T]
}
type RedBlackTree[T any] struct {
	root, nilNode *rbNode[T]
	count         int
	compare       shared.Comparator[T]
}

func NewRedBlackTree[T any](cs ...shared.Comparator[T]) *RedBlackTree[T] {
	n := &rbNode[T]{}
	n.left, n.right, n.parent = n, n, n
	return &RedBlackTree[T]{root: n, nilNode: n, compare: shared.Compare(cs)}
}
func (t *RedBlackTree[T]) Size() int { return t.count }
func (t *RedBlackTree[T]) search(v T) *rbNode[T] {
	n := t.root
	for n != t.nilNode {
		o := t.compare(v, n.value)
		if o == 0 {
			return n
		}
		if o < 0 {
			n = n.left
		} else {
			n = n.right
		}
	}
	return n
}
func (t *RedBlackTree[T]) Has(v T) bool { return t.search(v) != t.nilNode }
func (t *RedBlackTree[T]) left(n *rbNode[T]) {
	p := n.right
	n.right = p.left
	if p.left != t.nilNode {
		p.left.parent = n
	}
	p.parent = n.parent
	if n.parent == t.nilNode {
		t.root = p
	} else if n == n.parent.left {
		n.parent.left = p
	} else {
		n.parent.right = p
	}
	p.left = n
	n.parent = p
}
func (t *RedBlackTree[T]) right(n *rbNode[T]) {
	p := n.left
	n.left = p.right
	if p.right != t.nilNode {
		p.right.parent = n
	}
	p.parent = n.parent
	if n.parent == t.nilNode {
		t.root = p
	} else if n == n.parent.right {
		n.parent.right = p
	} else {
		n.parent.left = p
	}
	p.right = n
	n.parent = p
}
func (t *RedBlackTree[T]) Insert(v T) bool {
	p, n := t.nilNode, t.root
	for n != t.nilNode {
		p = n
		o := t.compare(v, n.value)
		if o == 0 {
			return false
		}
		if o < 0 {
			n = n.left
		} else {
			n = n.right
		}
	}
	n = &rbNode[T]{v, true, t.nilNode, t.nilNode, p}
	if p == t.nilNode {
		t.root = n
	} else if t.compare(v, p.value) < 0 {
		p.left = n
	} else {
		p.right = n
	}
	for n.parent.red {
		p := n.parent
		g := p.parent
		if p == g.left {
			u := g.right
			if u.red {
				p.red = false
				u.red = false
				g.red = true
				n = g
				continue
			}
			if n == p.right {
				n = p
				t.left(n)
			}
			n.parent.red = false
			g.red = true
			t.right(g)
		} else {
			u := g.left
			if u.red {
				p.red = false
				u.red = false
				g.red = true
				n = g
				continue
			}
			if n == p.left {
				n = p
				t.right(n)
			}
			n.parent.red = false
			g.red = true
			t.left(g)
		}
	}
	t.root.red = false
	t.count++
	return true
}
func (t *RedBlackTree[T]) transplant(a, b *rbNode[T]) {
	if a.parent == t.nilNode {
		t.root = b
	} else if a == a.parent.left {
		a.parent.left = b
	} else {
		a.parent.right = b
	}
	b.parent = a.parent
}
func (t *RedBlackTree[T]) Delete(v T) bool {
	z := t.search(v)
	if z == t.nilNode {
		return false
	}
	y := z
	red := y.red
	var x *rbNode[T]
	if z.left == t.nilNode {
		x = z.right
		t.transplant(z, x)
	} else if z.right == t.nilNode {
		x = z.left
		t.transplant(z, x)
	} else {
		y = z.right
		for y.left != t.nilNode {
			y = y.left
		}
		red = y.red
		x = y.right
		if y.parent == z {
			x.parent = y
		} else {
			t.transplant(y, y.right)
			y.right = z.right
			y.right.parent = y
		}
		t.transplant(z, y)
		y.left = z.left
		y.left.parent = y
		y.red = z.red
	}
	if !red {
		t.fixDelete(x)
	}
	t.count--
	return true
}
func (t *RedBlackTree[T]) fixDelete(n *rbNode[T]) {
	for n != t.root && !n.red {
		if n == n.parent.left {
			s := n.parent.right
			if s.red {
				s.red = false
				n.parent.red = true
				t.left(n.parent)
				s = n.parent.right
			}
			if !s.left.red && !s.right.red {
				s.red = true
				n = n.parent
			} else {
				if !s.right.red {
					s.left.red = false
					s.red = true
					t.right(s)
					s = n.parent.right
				}
				s.red = n.parent.red
				n.parent.red = false
				s.right.red = false
				t.left(n.parent)
				n = t.root
			}
		} else {
			s := n.parent.left
			if s.red {
				s.red = false
				n.parent.red = true
				t.right(n.parent)
				s = n.parent.left
			}
			if !s.left.red && !s.right.red {
				s.red = true
				n = n.parent
			} else {
				if !s.left.red {
					s.right.red = false
					s.red = true
					t.left(s)
					s = n.parent.left
				}
				s.red = n.parent.red
				n.parent.red = false
				s.left.red = false
				t.right(n.parent)
				n = t.root
			}
		}
	}
	n.red = false
}
func (t *RedBlackTree[T]) Height() int {
	var f func(*rbNode[T]) int
	f = func(n *rbNode[T]) int {
		if n == t.nilNode {
			return 0
		}
		return 1 + max(f(n.left), f(n.right))
	}
	return f(t.root)
}
func (t *RedBlackTree[T]) IsValid() bool {
	if t.root.red {
		return false
	}
	var f func(*rbNode[T]) int
	f = func(n *rbNode[T]) int {
		if n == t.nilNode {
			return 1
		}
		if n.red && (n.left.red || n.right.red) {
			return -1
		}
		l, r := f(n.left), f(n.right)
		if l < 0 || r < 0 || l != r {
			return -1
		}
		if !n.red {
			l++
		}
		return l
	}
	return f(t.root) >= 0
}
func (t *RedBlackTree[T]) ToArray() []T {
	out := []T{}
	var f func(*rbNode[T])
	f = func(n *rbNode[T]) {
		if n == t.nilNode {
			return
		}
		f(n.left)
		out = append(out, n.value)
		f(n.right)
	}
	f(t.root)
	return out
}
