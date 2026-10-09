from dataclasses import dataclass


@dataclass(frozen=True)
class TreeType:
    name: str
    color: str
    texture: str

    def draw(self, x, y):
        return f'{self.name}({self.color}) at {x},{y}'


class TreeTypeFactory:
    def __init__(self):
        self.types = {}

    @property
    def count(self):
        return len(self.types)

    def get(self, name, color, texture):
        key = (name, color, texture)
        if key not in self.types:
            self.types[key] = TreeType(*key)
        return self.types[key]


class Forest:
    def __init__(self, factory=None):
        self.factory, self.trees = factory or TreeTypeFactory(), []

    @property
    def tree_count(self):
        return len(self.trees)

    @property
    def type_count(self):
        return self.factory.count

    def plant(self, x, y, name, color, texture):
        self.trees.append((x, y, self.factory.get(name, color, texture)))
        return self

    def draw(self):
        return [type.draw(x, y) for x, y, type in self.trees]
