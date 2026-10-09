package creational

import "math"

type Prototype[T any] interface{ Clone() T }
type Shape interface {
	Clone() Shape
	Area() float64
}
type ShapeBase struct {
	X, Y  float64
	Color string
	Tags  []string
}
type Circle struct {
	ShapeBase
	Radius float64
}

func (c *Circle) Clone() Shape  { copy := *c; copy.Tags = append([]string{}, c.Tags...); return &copy }
func (c *Circle) Area() float64 { return math.Pi * c.Radius * c.Radius }

type Rectangle struct {
	ShapeBase
	Width, Height float64
}

func (r *Rectangle) Clone() Shape {
	copy := *r
	copy.Tags = append([]string{}, r.Tags...)
	return &copy
}
func (r *Rectangle) Area() float64 { return r.Width * r.Height }

type PrototypeRegistry[T Prototype[T]] struct{ prototypes map[string]T }

func (r *PrototypeRegistry[T]) Register(key string, prototype T) *PrototypeRegistry[T] {
	if r.prototypes == nil {
		r.prototypes = map[string]T{}
	}
	r.prototypes[key] = prototype
	return r
}
func (r *PrototypeRegistry[T]) Create(key string) T {
	prototype, ok := r.prototypes[key]
	if !ok {
		panic("unknown prototype " + key)
	}
	return prototype.Clone()
}
