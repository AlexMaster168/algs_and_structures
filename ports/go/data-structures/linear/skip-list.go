package linear

import (
	"algs/shared"
	"math/rand"
)

type skipNode[T any] struct {
	value T
	next  []*skipNode[T]
}
type SkipList[T any] struct {
	head                    *skipNode[T]
	level, length, maxLevel int
	probability             float64
	compare                 shared.Comparator[T]
}

func NewSkipList[T any](c shared.Comparator[T], maxLevel int, probability float64) *SkipList[T] {
	if c == nil {
		c = shared.DefaultCompare[T]
	}
	if maxLevel < 1 || probability < 0 || probability >= 1 {
		panic("invalid skip list options")
	}
	return &SkipList[T]{head: &skipNode[T]{next: make([]*skipNode[T], maxLevel)}, level: 1, maxLevel: maxLevel, probability: probability, compare: c}
}
func (s *SkipList[T]) Size() int { return s.length }
func (s *SkipList[T]) predecessors(v T) []*skipNode[T] {
	u := make([]*skipNode[T], s.maxLevel)
	n := s.head
	for i := s.level - 1; i >= 0; i-- {
		for n.next[i] != nil && s.compare(n.next[i].value, v) < 0 {
			n = n.next[i]
		}
		u[i] = n
	}
	return u
}
func (s *SkipList[T]) Has(v T) bool {
	n := s.predecessors(v)[0].next[0]
	return n != nil && s.compare(n.value, v) == 0
}
func (s *SkipList[T]) Insert(v T) bool {
	u := s.predecessors(v)
	n := u[0].next[0]
	if n != nil && s.compare(n.value, v) == 0 {
		return false
	}
	l := 1
	for l < s.maxLevel && rand.Float64() < s.probability {
		l++
	}
	for i := s.level; i < l; i++ {
		u[i] = s.head
	}
	s.level = max(s.level, l)
	n = &skipNode[T]{v, make([]*skipNode[T], l)}
	for i := 0; i < l; i++ {
		n.next[i] = u[i].next[i]
		u[i].next[i] = n
	}
	s.length++
	return true
}
func (s *SkipList[T]) Delete(v T) bool {
	u := s.predecessors(v)
	n := u[0].next[0]
	if n == nil || s.compare(n.value, v) != 0 {
		return false
	}
	for i := 0; i < s.level; i++ {
		if u[i].next[i] != n {
			break
		}
		u[i].next[i] = n.next[i]
	}
	for s.level > 1 && s.head.next[s.level-1] == nil {
		s.level--
	}
	s.length--
	return true
}
func (s *SkipList[T]) ToArray() []T {
	r := []T{}
	for n := s.head.next[0]; n != nil; n = n.next[0] {
		r = append(r, n.value)
	}
	return r
}
