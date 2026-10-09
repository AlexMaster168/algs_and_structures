class Queue:
    def __init__(self):
        self.items, self.head = [], 0

    @property
    def size(self):
        return len(self.items) - self.head

    def is_empty(self):
        return self.size == 0

    def enqueue(self, value):
        self.items.append(value)
        return self

    def dequeue(self):
        if self.is_empty():
            return None
        value = self.items[self.head]
        self.head += 1
        if self.head * 2 >= len(self.items):
            self.items = self.items[self.head:]
            self.head = 0
        return value

    def peek(self):
        return None if self.is_empty() else self.items[self.head]

    def to_array(self):
        return list(self)

    def __iter__(self):
        for i in range(self.head, len(self.items)):
            yield self.items[i]
