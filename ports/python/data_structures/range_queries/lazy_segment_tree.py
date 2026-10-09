class LazySegmentTree:
    def __init__(self, values):
        self.n = len(values)
        self.sums, self.pending = [0] * (4 * max(1, self.n)), [0] * (4 * max(1, self.n))
        if self.n:
            self._build(1, 0, self.n - 1, values)

    @property
    def size(self):
        return self.n

    def _assert_range(self, left, right):
        if left < 0 or right >= self.n or left > right:
            raise IndexError(f'Invalid range [{left}, {right}]')

    def range_add(self, left, right, delta):
        self._assert_range(left, right)
        self._add(1, 0, self.n - 1, left, right, delta)

    def range_sum(self, left, right):
        self._assert_range(left, right)
        return self._sum(1, 0, self.n - 1, left, right)

    def _build(self, node, start, end, values):
        if start == end:
            self.sums[node] = values[start]
            return
        mid = (start + end) // 2
        self._build(2 * node, start, mid, values)
        self._build(2 * node + 1, mid + 1, end, values)
        self.sums[node] = self.sums[2 * node] + self.sums[2 * node + 1]

    def _apply(self, node, start, end, delta):
        self.sums[node] += delta * (end - start + 1)
        self.pending[node] += delta

    def _push(self, node, start, end):
        delta = self.pending[node]
        if delta == 0:
            return
        mid = (start + end) // 2
        self._apply(2 * node, start, mid, delta)
        self._apply(2 * node + 1, mid + 1, end, delta)
        self.pending[node] = 0

    def _add(self, node, start, end, left, right, delta):
        if right < start or end < left:
            return
        if left <= start and end <= right:
            self._apply(node, start, end, delta)
            return
        self._push(node, start, end)
        mid = (start + end) // 2
        self._add(2 * node, start, mid, left, right, delta)
        self._add(2 * node + 1, mid + 1, end, left, right, delta)
        self.sums[node] = self.sums[2 * node] + self.sums[2 * node + 1]

    def _sum(self, node, start, end, left, right):
        if right < start or end < left:
            return 0
        if left <= start and end <= right:
            return self.sums[node]
        self._push(node, start, end)
        mid = (start + end) // 2
        return self._sum(2 * node, start, mid, left, right) + self._sum(2 * node + 1, mid + 1, end, left, right)
