class CircularBuffer:
    def __init__(self, capacity):
        if not isinstance(capacity, int) or capacity <= 0:
            raise ValueError('Capacity must be a positive integer')
        self.capacity = capacity
        self.buffer = [None] * capacity
        self.start = self.length = 0

    @property
    def size(self):
        return self.length

    def is_full(self):
        return self.length == self.capacity

    def is_empty(self):
        return self.length == 0

    def push(self, value):
        if self.is_full():
            overwritten = self.buffer[self.start]
            self.buffer[self.start] = value
            self.start = (self.start + 1) % self.capacity
            return overwritten
        self.buffer[(self.start + self.length) % self.capacity] = value
        self.length += 1
        return None

    def shift(self):
        if self.is_empty():
            return None
        value, self.buffer[self.start] = self.buffer[self.start], None
        self.start = (self.start + 1) % self.capacity
        self.length -= 1
        return value

    def to_array(self):
        return list(self)

    def __iter__(self):
        for i in range(self.length):
            yield self.buffer[(self.start + i) % self.capacity]
