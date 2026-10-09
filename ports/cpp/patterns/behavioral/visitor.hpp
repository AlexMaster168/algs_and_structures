#pragma once
#include "../../shared/json.hpp"
#include <cmath>
namespace algs {
struct CircleShape; struct RectangleShape; struct TriangleShape;
template<class R> struct ShapeVisitor { virtual ~ShapeVisitor() = default; virtual R visitCircle(const CircleShape&) const = 0; virtual R visitRectangle(const RectangleShape&) const = 0; virtual R visitTriangle(const TriangleShape&) const = 0; };
struct CircleShape { double radius; explicit CircleShape(double radius): radius(radius) {} template<class R> R accept(const ShapeVisitor<R>& visitor) const { return visitor.visitCircle(*this); } };
struct RectangleShape { double width, height; RectangleShape(double width, double height): width(width), height(height) {} template<class R> R accept(const ShapeVisitor<R>& visitor) const { return visitor.visitRectangle(*this); } };
struct TriangleShape { double a, b, c; TriangleShape(double a, double b, double c): a(a), b(b), c(c) {} template<class R> R accept(const ShapeVisitor<R>& visitor) const { return visitor.visitTriangle(*this); } };
struct AreaVisitor : ShapeVisitor<double> { double visitCircle(const CircleShape& shape) const override { return std::acos(-1) * shape.radius * shape.radius; } double visitRectangle(const RectangleShape& shape) const override { return shape.width * shape.height; } double visitTriangle(const TriangleShape& shape) const override { auto s = (shape.a + shape.b + shape.c) / 2; return std::sqrt(s * (s - shape.a) * (s - shape.b) * (s - shape.c)); } };
struct PerimeterVisitor : ShapeVisitor<double> { double visitCircle(const CircleShape& shape) const override { return 2 * std::acos(-1) * shape.radius; } double visitRectangle(const RectangleShape& shape) const override { return 2 * (shape.width + shape.height); } double visitTriangle(const TriangleShape& shape) const override { return shape.a + shape.b + shape.c; } };
struct JsonExportVisitor : ShapeVisitor<std::string> { std::string visitCircle(const CircleShape& shape) const override { return "{\"type\":\"circle\",\"radius\":" + Json(shape.radius).dump() + "}"; } std::string visitRectangle(const RectangleShape& shape) const override { return "{\"type\":\"rectangle\",\"width\":" + Json(shape.width).dump() + ",\"height\":" + Json(shape.height).dump() + "}"; } std::string visitTriangle(const TriangleShape& shape) const override { return "{\"type\":\"triangle\",\"sides\":" + Json(Numbers{shape.a, shape.b, shape.c}).dump() + "}"; } };
}
