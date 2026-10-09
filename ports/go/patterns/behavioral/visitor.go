package behavioral

import (
	"encoding/json"
	"math"
)

type ShapeVisitor[R any] interface {
	VisitCircle(CircleShape) R
	VisitRectangle(RectangleShape) R
	VisitTriangle(TriangleShape) R
}
type VisitableShape interface{ shape() }
type CircleShape struct{ Radius float64 }

func (CircleShape) shape() {}

type RectangleShape struct{ Width, Height float64 }

func (RectangleShape) shape() {}

type TriangleShape struct{ A, B, C float64 }

func (TriangleShape) shape() {}
func Accept[R any](shape VisitableShape, visitor ShapeVisitor[R]) R {
	switch value := shape.(type) {
	case CircleShape:
		return visitor.VisitCircle(value)
	case RectangleShape:
		return visitor.VisitRectangle(value)
	case TriangleShape:
		return visitor.VisitTriangle(value)
	default:
		panic("unknown shape")
	}
}

type AreaVisitor struct{}

func (AreaVisitor) VisitCircle(shape CircleShape) float64 {
	return math.Pi * shape.Radius * shape.Radius
}
func (AreaVisitor) VisitRectangle(shape RectangleShape) float64 { return shape.Width * shape.Height }
func (AreaVisitor) VisitTriangle(shape TriangleShape) float64 {
	s := (shape.A + shape.B + shape.C) / 2
	return math.Sqrt(s * (s - shape.A) * (s - shape.B) * (s - shape.C))
}

type PerimeterVisitor struct{}

func (PerimeterVisitor) VisitCircle(shape CircleShape) float64 { return 2 * math.Pi * shape.Radius }
func (PerimeterVisitor) VisitRectangle(shape RectangleShape) float64 {
	return 2 * (shape.Width + shape.Height)
}
func (PerimeterVisitor) VisitTriangle(shape TriangleShape) float64 {
	return shape.A + shape.B + shape.C
}

type JsonExportVisitor struct{}

func exportJSON(value any) string {
	data, error := json.Marshal(value)
	if error != nil {
		panic(error)
	}
	return string(data)
}
func (JsonExportVisitor) VisitCircle(shape CircleShape) string {
	return exportJSON(struct {
		Type   string  `json:"type"`
		Radius float64 `json:"radius"`
	}{"circle", shape.Radius})
}
func (JsonExportVisitor) VisitRectangle(shape RectangleShape) string {
	return exportJSON(struct {
		Type   string  `json:"type"`
		Width  float64 `json:"width"`
		Height float64 `json:"height"`
	}{"rectangle", shape.Width, shape.Height})
}
func (JsonExportVisitor) VisitTriangle(shape TriangleShape) string {
	return exportJSON(struct {
		Type  string     `json:"type"`
		Sides [3]float64 `json:"sides"`
	}{"triangle", [3]float64{shape.A, shape.B, shape.C}})
}
