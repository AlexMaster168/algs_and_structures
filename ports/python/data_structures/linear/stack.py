class Stack:
    def __init__(self):
        self.items = []

    @property
    def size(self):
        return len(self.items)

    def is_empty(self):
        return not self.items

    def push(self, value):
        self.items.append(value)
        return self

    def pop(self):
        return self.items.pop() if self.items else None

    def peek(self):
        return self.items[-1] if self.items else None

    def to_array(self):
        return list(self)

    def __iter__(self):
        return reversed(self.items)
