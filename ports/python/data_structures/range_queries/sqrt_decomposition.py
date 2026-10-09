from math import ceil, sqrt


class SqrtDecomposition:
    def __init__(self, values):
        self.values = list(values)
        self.block_size = max(1, ceil(sqrt(len(values))))
        self.block_sums = [0] * ceil(len(values) / self.block_size)
        for i, value in enumerate(values):
            self.block_sums[i // self.block_size] += value

    def update(self, index, value):
        self.block_sums[index // self.block_size] += value - self.values[index]
        self.values[index] = value

    def range_sum(self, left, right):
        total, i = 0, left
        while i <= right and i % self.block_size != 0:
            total += self.values[i]
            i += 1
        while i + self.block_size - 1 <= right:
            total += self.block_sums[i // self.block_size]
            i += self.block_size
        while i <= right:
            total += self.values[i]
            i += 1
        return total
