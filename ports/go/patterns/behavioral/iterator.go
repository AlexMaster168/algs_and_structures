package behavioral

import "iter"

type ClassicIterator[T any] interface {
	HasNext() bool
	Next() T
}
type NumberRange struct{ Start, End, Step float64 }

func NewNumberRange(start, end float64, steps ...float64) NumberRange {
	step := 1.0
	if len(steps) > 0 {
		step = steps[0]
	}
	if step == 0 {
		panic("step must not be zero")
	}
	return NumberRange{start, end, step}
}

type rangeIterator struct{ current, end, step float64 }

func (i *rangeIterator) HasNext() bool {
	if i.step > 0 {
		return i.current < i.end
	}
	return i.current > i.end
}
func (i *rangeIterator) Next() float64 { value := i.current; i.current += i.step; return value }
func (r NumberRange) CreateIterator() ClassicIterator[float64] {
	return &rangeIterator{r.Start, r.End, r.Step}
}
func (r NumberRange) All() iter.Seq[float64] {
	return func(yield func(float64) bool) {
		iterator := r.CreateIterator()
		for iterator.HasNext() {
			if !yield(iterator.Next()) {
				return
			}
		}
	}
}

type TreeItem[T any] struct {
	Value    T
	Children []TreeItem[T]
}

func DepthFirst[T any](roots []TreeItem[T]) iter.Seq[T] {
	return func(yield func(T) bool) {
		var walk func([]TreeItem[T]) bool
		walk = func(nodes []TreeItem[T]) bool {
			for _, node := range nodes {
				if !yield(node.Value) || !walk(node.Children) {
					return false
				}
			}
			return true
		}
		walk(roots)
	}
}
func BreadthFirst[T any](roots []TreeItem[T]) iter.Seq[T] {
	return func(yield func(T) bool) {
		queue := append([]TreeItem[T]{}, roots...)
		for head := 0; head < len(queue); head++ {
			item := queue[head]
			if !yield(item.Value) {
				return
			}
			queue = append(queue, item.Children...)
		}
	}
}
func Take[T any](source iter.Seq[T], count int) iter.Seq[T] {
	return func(yield func(T) bool) {
		if count <= 0 {
			return
		}
		for item := range source {
			if !yield(item) {
				return
			}
			count--
			if count == 0 {
				return
			}
		}
	}
}
