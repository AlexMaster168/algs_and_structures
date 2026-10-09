import json
import math
from dataclasses import dataclass


@dataclass(frozen=True)
class CircleShape:
    radius: float

    def accept(self, visitor):
        return visitor.visit_circle(self)


@dataclass(frozen=True)
class RectangleShape:
    width: float
    height: float

    def accept(self, visitor):
        return visitor.visit_rectangle(self)


@dataclass(frozen=True)
class TriangleShape:
    a: float
    b: float
    c: float

    def accept(self, visitor):
        return visitor.visit_triangle(self)


class AreaVisitor:
    def visit_circle(self, circle):
        return math.pi * circle.radius ** 2

    def visit_rectangle(self, rectangle):
        return rectangle.width * rectangle.height

    def visit_triangle(self, triangle):
        a, b, c = triangle.a, triangle.b, triangle.c
        s = (a + b + c) / 2
        return math.sqrt(s * (s - a) * (s - b) * (s - c))


class PerimeterVisitor:
    def visit_circle(self, circle):
        return 2 * math.pi * circle.radius

    def visit_rectangle(self, rectangle):
        return 2 * (rectangle.width + rectangle.height)

    def visit_triangle(self, triangle):
        return triangle.a + triangle.b + triangle.c


class JsonExportVisitor:
    @staticmethod
    def encode(value):
        return json.dumps(value, separators=(',', ':'))

    def visit_circle(self, circle):
        return self.encode({'type': 'circle', 'radius': circle.radius})

    def visit_rectangle(self, rectangle):
        return self.encode({'type': 'rectangle', 'width': rectangle.width, 'height': rectangle.height})

    def visit_triangle(self, triangle):
        return self.encode({'type': 'triangle', 'sides': [triangle.a, triangle.b, triangle.c]})
