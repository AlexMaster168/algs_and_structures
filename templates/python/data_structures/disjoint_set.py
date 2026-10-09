class DisjointSet:
    def __init__(self, size):
        if size < 0:
            raise ValueError('Size must be nonnegative')
        self.parent = list(range(size))
        self.sizes = [1] * size

    def find(self, value):
        if value < 0 or value >= len(self.parent):
            raise IndexError(value)
        while value != self.parent[value]:
            self.parent[value] = self.parent[self.parent[value]]
            value = self.parent[value]
        return value

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.sizes[a] < self.sizes[b]:
            a, b = b, a
        self.parent[b] = a
        self.sizes[a] += self.sizes[b]
        return True
