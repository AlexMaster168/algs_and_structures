from ...shared.compare import default_compare


class BinaryHeap:
    def __init__(self, compare=default_compare, values=()):
        self.compare, self.items = compare, list(values)
        for i in range(len(self.items) // 2 - 1, -1, -1):
            self._sift_down(i)

    @property
    def size(self):
        return len(self.items)

    def is_empty(self):
        return not self.items

    def peek(self):
        return self.items[0] if self.items else None

    def push(self, *values):
        for value in values:
            self.items.append(value)
            self._sift_up(len(self.items) - 1)
        return self

    def pop(self):
        if not self.items:
            return None
        top, last = self.items[0], self.items.pop()
        if self.items:
            self.items[0] = last
            self._sift_down(0)
        return top

    def push_pop(self, value):
        if not self.items or self.compare(value, self.items[0]) <= 0:
            return value
        top, self.items[0] = self.items[0], value
        self._sift_down(0)
        return top

    def to_sorted_array(self):
        copy, result = BinaryHeap(self.compare, self.items), []
        while not copy.is_empty():
            result.append(copy.pop())
        return result

    def __iter__(self):
        return iter(self.items)

    def _sift_up(self, index):
        while index > 0:
            parent = (index - 1) // 2
            if self.compare(self.items[index], self.items[parent]) >= 0:
                break
            self.items[index], self.items[parent] = self.items[parent], self.items[index]
            index = parent

    def _sift_down(self, index):
        while True:
            left, right, best = 2 * index + 1, 2 * index + 2, index
            if left < len(self.items) and self.compare(self.items[left], self.items[best]) < 0:
                best = left
            if right < len(self.items) and self.compare(self.items[right], self.items[best]) < 0:
                best = right
            if best == index:
                return
            self.items[index], self.items[best] = self.items[best], self.items[index]
            index = best


class MinHeap(BinaryHeap):
    def __init__(self, values=()):
        super().__init__(default_compare, values)


class MaxHeap(BinaryHeap):
    def __init__(self, values=()):
        super().__init__(lambda a, b: default_compare(b, a), values)
