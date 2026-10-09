class FenwickTree:
    def __init__(self, size_or_values):
        if isinstance(size_or_values, int):
            self.tree = [0] * (size_or_values + 1)
        else:
            self.tree = [0] + list(size_or_values)
            for i in range(1, len(self.tree)):
                parent = i + (i & -i)
                if parent < len(self.tree):
                    self.tree[parent] += self.tree[i]

    @property
    def size(self):
        return len(self.tree) - 1

    def add(self, index, delta):
        if index < 0 or index >= self.size:
            raise IndexError('Index out of bounds')
        i = index + 1
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i

    def set(self, index, value):
        self.add(index, value - self.range_sum(index, index))

    def prefix_sum(self, index):
        total, i = 0, min(index + 1, self.size)
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total

    def range_sum(self, left, right):
        return self.prefix_sum(right) - (self.prefix_sum(left - 1) if left > 0 else 0)
