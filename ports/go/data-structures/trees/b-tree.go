package trees

import "algs/shared"

type bNode[T any] struct {
	keys     []T
	children []*bNode[T]
}
type BTree[T any] struct {
	root      *bNode[T]
	MinDegree int
	count     int
	compare   shared.Comparator[T]
}

func NewBTree[T any](degree int, cs ...shared.Comparator[T]) *BTree[T] {
	if degree < 2 {
		panic("invalid minimum degree")
	}
	return &BTree[T]{root: &bNode[T]{}, MinDegree: degree, compare: shared.Compare(cs)}
}
func (t *BTree[T]) Size() int { return t.count }
func (t *BTree[T]) Height() int {
	h := 1
	for n := t.root; len(n.children) > 0; n = n.children[0] {
		h++
	}
	return h
}
func (t *BTree[T]) index(n *bNode[T], v T) int {
	l, h := 0, len(n.keys)
	for l < h {
		m := (l + h) / 2
		if t.compare(n.keys[m], v) < 0 {
			l = m + 1
		} else {
			h = m
		}
	}
	return l
}
func (t *BTree[T]) Has(v T) bool {
	n := t.root
	for {
		i := t.index(n, v)
		if i < len(n.keys) && t.compare(n.keys[i], v) == 0 {
			return true
		}
		if len(n.children) == 0 {
			return false
		}
		n = n.children[i]
	}
}
func insertAt[T any](a []T, i int, v T) []T {
	a = append(a, v)
	copy(a[i+1:], a[i:len(a)-1])
	a[i] = v
	return a
}
func eraseAt[T any](a []T, i int) []T { copy(a[i:], a[i+1:]); return a[:len(a)-1] }
func (t *BTree[T]) split(p *bNode[T], i int) {
	n := p.children[i]
	d := t.MinDegree
	r := &bNode[T]{keys: append([]T{}, n.keys[d:]...)}
	v := n.keys[d-1]
	n.keys = n.keys[:d-1]
	if len(n.children) > 0 {
		r.children = append([]*bNode[T]{}, n.children[d:]...)
		n.children = n.children[:d]
	}
	p.keys = insertAt(p.keys, i, v)
	p.children = insertAt(p.children, i+1, r)
}
func (t *BTree[T]) Insert(v T) bool {
	if t.Has(v) {
		return false
	}
	if len(t.root.keys) == 2*t.MinDegree-1 {
		n := &bNode[T]{children: []*bNode[T]{t.root}}
		t.split(n, 0)
		t.root = n
	}
	var add func(*bNode[T])
	add = func(n *bNode[T]) {
		i := t.index(n, v)
		if len(n.children) == 0 {
			n.keys = insertAt(n.keys, i, v)
			return
		}
		if len(n.children[i].keys) == 2*t.MinDegree-1 {
			t.split(n, i)
			if t.compare(v, n.keys[i]) > 0 {
				i++
			}
		}
		add(n.children[i])
	}
	add(t.root)
	t.count++
	return true
}
func (t *BTree[T]) merge(n *bNode[T], i int) {
	l, r := n.children[i], n.children[i+1]
	l.keys = append(l.keys, n.keys[i])
	l.keys = append(l.keys, r.keys...)
	l.children = append(l.children, r.children...)
	n.keys = eraseAt(n.keys, i)
	n.children = eraseAt(n.children, i+1)
}
func (t *BTree[T]) remove(n *bNode[T], v T) {
	i, d := t.index(n, v), t.MinDegree
	if i < len(n.keys) && t.compare(n.keys[i], v) == 0 {
		if len(n.children) == 0 {
			n.keys = eraseAt(n.keys, i)
			return
		}
		l, r := n.children[i], n.children[i+1]
		if len(l.keys) >= d {
			p := l
			for len(p.children) > 0 {
				p = p.children[len(p.children)-1]
			}
			v = p.keys[len(p.keys)-1]
			n.keys[i] = v
			t.remove(l, v)
		} else if len(r.keys) >= d {
			p := r
			for len(p.children) > 0 {
				p = p.children[0]
			}
			v = p.keys[0]
			n.keys[i] = v
			t.remove(r, v)
		} else {
			t.merge(n, i)
			t.remove(l, v)
		}
		return
	}
	if len(n.children) == 0 {
		return
	}
	c := n.children[i]
	if len(c.keys) < d {
		if i > 0 && len(n.children[i-1].keys) >= d {
			s := n.children[i-1]
			c.keys = insertAt(c.keys, 0, n.keys[i-1])
			n.keys[i-1] = s.keys[len(s.keys)-1]
			s.keys = s.keys[:len(s.keys)-1]
			if len(s.children) > 0 {
				c.children = insertAt(c.children, 0, s.children[len(s.children)-1])
				s.children = s.children[:len(s.children)-1]
			}
		} else if i+1 < len(n.children) && len(n.children[i+1].keys) >= d {
			s := n.children[i+1]
			c.keys = append(c.keys, n.keys[i])
			n.keys[i] = s.keys[0]
			s.keys = eraseAt(s.keys, 0)
			if len(s.children) > 0 {
				c.children = append(c.children, s.children[0])
				s.children = eraseAt(s.children, 0)
			}
		} else if i+1 < len(n.children) {
			t.merge(n, i)
		} else {
			t.merge(n, i-1)
			c = n.children[i-1]
		}
	}
	t.remove(c, v)
}
func (t *BTree[T]) Delete(v T) bool {
	if !t.Has(v) {
		return false
	}
	t.remove(t.root, v)
	if len(t.root.keys) == 0 && len(t.root.children) > 0 {
		t.root = t.root.children[0]
	}
	t.count--
	return true
}
func (t *BTree[T]) ToArray() []T {
	out := []T{}
	var f func(*bNode[T])
	f = func(n *bNode[T]) {
		for i, v := range n.keys {
			if len(n.children) > 0 {
				f(n.children[i])
			}
			out = append(out, v)
		}
		if len(n.children) > 0 {
			f(n.children[len(n.keys)])
		}
	}
	f(t.root)
	return out
}
