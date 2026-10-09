class DisjointSet:
    def __init__(self, size):
        self.parent, self.sizes, self.sets = list(range(size)), [1] * size, size

    @property
    def count(self):
        return self.sets

    def find(self, x):
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:
            next_node = self.parent[x]
            self.parent[x] = root
            x = next_node
        return root

    def union(self, a, b):
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.sizes[root_a] < self.sizes[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.sizes[root_a] += self.sizes[root_b]
        self.sets -= 1
        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)

    def size_of(self, x):
        return self.sizes[self.find(x)]
