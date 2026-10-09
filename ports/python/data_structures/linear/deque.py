class Deque:
    def __init__(self, initial_capacity=8):
        self.buffer = [None] * max(1, initial_capacity)
        self.head = self.length = 0

    @property
    def size(self):
        return self.length

    def is_empty(self):
        return self.length == 0

    def _ensure_capacity(self):
        if self.length < len(self.buffer):
            return
        self.buffer = list(self) + [None] * len(self.buffer)
        self.head = 0

    def push_back(self, value):
        self._ensure_capacity()
        self.buffer[(self.head + self.length) % len(self.buffer)] = value
        self.length += 1
        return self

    def push_front(self, value):
        self._ensure_capacity()
        self.head = (self.head - 1) % len(self.buffer)
        self.buffer[self.head] = value
        self.length += 1
        return self

    def pop_back(self):
        if not self.length:
            return None
        index = (self.head + self.length - 1) % len(self.buffer)
        value, self.buffer[index] = self.buffer[index], None
        self.length -= 1
        return value

    def pop_front(self):
        if not self.length:
            return None
        value, self.buffer[self.head] = self.buffer[self.head], None
        self.head = (self.head + 1) % len(self.buffer)
        self.length -= 1
        return value

    def peek_front(self):
        return None if not self.length else self.buffer[self.head]

    def peek_back(self):
        return None if not self.length else self.buffer[(self.head + self.length - 1) % len(self.buffer)]

    def at(self, index):
        if index < 0:
            index += self.length
        return None if index < 0 or index >= self.length else self.buffer[(self.head + index) % len(self.buffer)]

    def to_array(self):
        return list(self)

    def __iter__(self):
        for i in range(self.length):
            yield self.buffer[(self.head + i) % len(self.buffer)]
