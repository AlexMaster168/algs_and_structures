#pragma once
#include "../../support.hpp"
#include <cmath>
namespace algs {
struct Shape { double x, y; std::string color; std::vector<std::string> tags; Shape(double x, double y, std::string color, std::vector<std::string> tags = {}): x(x), y(y), color(std::move(color)), tags(std::move(tags)) {} virtual ~Shape() = default; virtual std::unique_ptr<Shape> clone() const = 0; virtual double area() const = 0; };
struct Circle : Shape { double radius; Circle(double x, double y, std::string color, double radius, std::vector<std::string> tags = {}): Shape(x, y, std::move(color), std::move(tags)), radius(radius) {} std::unique_ptr<Shape> clone() const override { return std::make_unique<Circle>(*this); } double area() const override { return std::acos(-1) * radius * radius; } };
struct Rectangle : Shape { double width, height; Rectangle(double x, double y, std::string color, double width, double height, std::vector<std::string> tags = {}): Shape(x, y, std::move(color), std::move(tags)), width(width), height(height) {} std::unique_ptr<Shape> clone() const override { return std::make_unique<Rectangle>(*this); } double area() const override { return width * height; } };
template<class T = Shape> class PrototypeRegistry { std::map<std::string, std::shared_ptr<T>> prototypes; public: PrototypeRegistry& registerPrototype(std::string key, std::shared_ptr<T> prototype) { prototypes[std::move(key)] = std::move(prototype); return *this; } std::unique_ptr<T> create(const std::string& key) const { auto clone = prototypes.at(key)->clone(); auto result = dynamic_cast<T*>(clone.get()); if (!result) throw std::logic_error("Prototype clone type mismatch"); clone.release(); return std::unique_ptr<T>(result); } };
}
