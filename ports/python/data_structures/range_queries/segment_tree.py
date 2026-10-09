from math import inf


class SegmentTree:
    def __init__(self, values, combine, identity):
        self.n, self.combine, self.identity = len(values), combine, identity
        self.tree = [identity] * self.n + list(values)
        for i in range(self.n - 1, 0, -1):
            self.tree[i] = combine(self.tree[2 * i], self.tree[2 * i + 1])

    @property
    def size(self):
        return self.n

    def _assert_index(self, index):
        if index < 0 or index >= self.n:
            raise IndexError(f'Index {index} is out of bounds')

    def get(self, index):
        self._assert_index(index)
        return self.tree[self.n + index]

    def update(self, index, value):
        self._assert_index(index)
        position = self.n + index
        self.tree[position] = value
        position >>= 1
        while position > 0:
            self.tree[position] = self.combine(self.tree[2 * position], self.tree[2 * position + 1])
            position >>= 1

    def query(self, left, right):
        if left < 0 or right >= self.n or left > right:
            raise IndexError(f'Invalid range [{left}, {right}]')
        result_left = result_right = self.identity
        l, r = left + self.n, right + self.n + 1
        while l < r:
            if l & 1:
                result_left = self.combine(result_left, self.tree[l])
                l += 1
            if r & 1:
                r -= 1
                result_right = self.combine(self.tree[r], result_right)
            l >>= 1
            r >>= 1
        return self.combine(result_left, result_right)


def sum_segment_tree(values):
    return SegmentTree(values, lambda a, b: a + b, 0)


def min_segment_tree(values):
    return SegmentTree(values, min, inf)


def max_segment_tree(values):
    return SegmentTree(values, max, -inf)
