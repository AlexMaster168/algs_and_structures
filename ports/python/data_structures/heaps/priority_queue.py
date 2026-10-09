from .binary_heap import BinaryHeap


class PriorityQueue:
    def __init__(self):
        self.heap = BinaryHeap(lambda a, b: a[1] - b[1] or a[2] - b[2])
        self.counter = 0

    @property
    def size(self):
        return self.heap.size

    def is_empty(self):
        return self.heap.is_empty()

    def enqueue(self, value, priority):
        self.heap.push((value, priority, self.counter))
        self.counter += 1
        return self

    def dequeue(self):
        entry = self.heap.pop()
        return entry[0] if entry is not None else None

    def peek(self):
        entry = self.heap.peek()
        return entry[0] if entry is not None else None

    def peek_priority(self):
        entry = self.heap.peek()
        return entry[1] if entry is not None else None
