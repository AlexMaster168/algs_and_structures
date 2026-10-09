package architectural

type Specification[T any] interface {
	IsSatisfiedBy(T) bool
	And(Specification[T]) Specification[T]
	Or(Specification[T]) Specification[T]
	Not() Specification[T]
}
type Spec[T any] struct{ Predicate func(T) bool }

func NewSpec[T any](predicate func(T) bool) Specification[T] { return Spec[T]{predicate} }
func (s Spec[T]) IsSatisfiedBy(candidate T) bool             { return s.Predicate(candidate) }
func (s Spec[T]) And(other Specification[T]) Specification[T] {
	return NewSpec(func(candidate T) bool { return s.IsSatisfiedBy(candidate) && other.IsSatisfiedBy(candidate) })
}
func (s Spec[T]) Or(other Specification[T]) Specification[T] {
	return NewSpec(func(candidate T) bool { return s.IsSatisfiedBy(candidate) || other.IsSatisfiedBy(candidate) })
}
func (s Spec[T]) Not() Specification[T] {
	return NewSpec(func(candidate T) bool { return !s.IsSatisfiedBy(candidate) })
}
