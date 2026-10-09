package geometry

import (
	"math"
	"sort"
)

type Point struct{ X, Y float64 }
type ClosestPairResult struct {
	A, B     Point
	Distance float64
}

func Cross(o, a, b Point) float64 { return (a.X-o.X)*(b.Y-o.Y) - (a.Y-o.Y)*(b.X-o.X) }
func Distance(a, b Point) float64 { return math.Hypot(a.X-b.X, a.Y-b.Y) }
func ConvexHull(points []Point) []Point {
	sorted := append([]Point{}, points...)
	sort.SliceStable(sorted, func(i, j int) bool {
		if sorted[i].X == sorted[j].X {
			return sorted[i].Y < sorted[j].Y
		}
		return sorted[i].X < sorted[j].X
	})
	if len(sorted) < 3 {
		return sorted
	}
	build := func(sequence []Point) []Point {
		hull := []Point{}
		for _, p := range sequence {
			for len(hull) >= 2 && Cross(hull[len(hull)-2], hull[len(hull)-1], p) <= 0 {
				hull = hull[:len(hull)-1]
			}
			hull = append(hull, p)
		}
		return hull[:len(hull)-1]
	}
	lower := build(sorted)
	for i, j := 0, len(sorted)-1; i < j; i, j = i+1, j-1 {
		sorted[i], sorted[j] = sorted[j], sorted[i]
	}
	return append(lower, build(sorted)...)
}
func PolygonArea(polygon []Point) float64 {
	area := 0.0
	for i, a := range polygon {
		b := polygon[(i+1)%len(polygon)]
		area += a.X*b.Y - b.X*a.Y
	}
	return math.Abs(area) / 2
}
func PointInPolygon(p Point, polygon []Point) bool {
	inside := false
	for i, j := 0, len(polygon)-1; i < len(polygon); j, i = i, i+1 {
		a, b := polygon[i], polygon[j]
		if (a.Y > p.Y) != (b.Y > p.Y) && p.X < (b.X-a.X)*(p.Y-a.Y)/(b.Y-a.Y)+a.X {
			inside = !inside
		}
	}
	return inside
}
func onSegment(p, q, r Point) bool {
	return min(p.X, r.X) <= q.X && q.X <= max(p.X, r.X) && min(p.Y, r.Y) <= q.Y && q.Y <= max(p.Y, r.Y)
}
func SegmentsIntersect(p1, p2, q1, q2 Point) bool {
	sign := func(v float64) int {
		if v < 0 {
			return -1
		}
		if v > 0 {
			return 1
		}
		return 0
	}
	d1, d2, d3, d4 := sign(Cross(p1, p2, q1)), sign(Cross(p1, p2, q2)), sign(Cross(q1, q2, p1)), sign(Cross(q1, q2, p2))
	return d1 != d2 && d3 != d4 || d1 == 0 && onSegment(p1, q1, p2) || d2 == 0 && onSegment(p1, q2, p2) || d3 == 0 && onSegment(q1, p1, q2) || d4 == 0 && onSegment(q1, p2, q2)
}
func ClosestPair(points []Point) *ClosestPairResult {
	if len(points) < 2 {
		return nil
	}
	byX := append([]Point{}, points...)
	sort.SliceStable(byX, func(i, j int) bool { return byX[i].X < byX[j].X })
	best := ClosestPairResult{byX[0], byX[1], Distance(byX[0], byX[1])}
	update := func(a, b Point) {
		d := Distance(a, b)
		if d < best.Distance {
			best = ClosestPairResult{a, b, d}
		}
	}
	var solve func(int, int) []Point
	solve = func(left, right int) []Point {
		if right-left <= 3 {
			for i := left; i < right; i++ {
				for j := i + 1; j < right; j++ {
					update(byX[i], byX[j])
				}
			}
			result := append([]Point{}, byX[left:right]...)
			sort.SliceStable(result, func(i, j int) bool { return result[i].Y < result[j].Y })
			return result
		}
		mid := (left + right) / 2
		midX := byX[mid].X
		a, b := solve(left, mid), solve(mid, right)
		merged := []Point{}
		i, j := 0, 0
		for i < len(a) || j < len(b) {
			if j >= len(b) || i < len(a) && a[i].Y <= b[j].Y {
				merged = append(merged, a[i])
				i++
			} else {
				merged = append(merged, b[j])
				j++
			}
		}
		strip := []Point{}
		for _, p := range merged {
			if math.Abs(p.X-midX) < best.Distance {
				strip = append(strip, p)
			}
		}
		for i, p := range strip {
			for j := i + 1; j < len(strip) && strip[j].Y-p.Y < best.Distance; j++ {
				update(p, strip[j])
			}
		}
		return merged
	}
	solve(0, len(points))
	return &best
}
