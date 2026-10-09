import math
from abc import ABC, abstractmethod


class Shape(ABC):
    def __init__(self, x, y, color, tags=None):
        self.x, self.y, self.color, self.tags = x, y, color, list(tags or [])

    @abstractmethod
    def clone(self):
        raise NotImplementedError

    @abstractmethod
    def area(self):
        raise NotImplementedError


class Circle(Shape):
    def __init__(self, x, y, color, radius, tags=None):
        super().__init__(x, y, color, tags)
        self.radius = radius

    def clone(self):
        return Circle(self.x, self.y, self.color, self.radius, self.tags)

    def area(self):
        return math.pi * self.radius ** 2


class Rectangle(Shape):
    def __init__(self, x, y, color, width, height, tags=None):
        super().__init__(x, y, color, tags)
        self.width, self.height = width, height

    def clone(self):
        return Rectangle(self.x, self.y, self.color, self.width, self.height, self.tags)

    def area(self):
        return self.width * self.height


class PrototypeRegistry:
    def __init__(self):
        self.prototypes = {}

    def register(self, key, prototype):
        self.prototypes[key] = prototype
        return self

    def create(self, key):
        return self.prototypes[key].clone()
