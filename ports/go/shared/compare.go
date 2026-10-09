package shared

import "reflect"

type Ordered interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 | ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~float32 | ~float64 | ~string
}
type Comparator[T any] func(T, T) int

func DefaultCompare[T any](a, b T) int {
	x, y := reflect.ValueOf(a), reflect.ValueOf(b)
	switch x.Kind() {
	case reflect.String:
		if x.String() < y.String() {
			return -1
		}
		if x.String() > y.String() {
			return 1
		}
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		if x.Int() < y.Int() {
			return -1
		}
		if x.Int() > y.Int() {
			return 1
		}
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		if x.Uint() < y.Uint() {
			return -1
		}
		if x.Uint() > y.Uint() {
			return 1
		}
	case reflect.Float32, reflect.Float64:
		if x.Float() < y.Float() {
			return -1
		}
		if x.Float() > y.Float() {
			return 1
		}
	default:
		panic("comparator required")
	}
	return 0
}
func Compare[T any](cs []Comparator[T]) Comparator[T] {
	if len(cs) > 0 && cs[0] != nil {
		return cs[0]
	}
	return DefaultCompare[T]
}
func ReverseCompare[T any](cs ...Comparator[T]) Comparator[T] {
	c := Compare(cs)
	return func(a, b T) int { return c(b, a) }
}
