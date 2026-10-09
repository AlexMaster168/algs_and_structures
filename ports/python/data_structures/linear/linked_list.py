class LinkedListNode:
    def __init__(self, value):
        self.value, self.next = value, None


class LinkedList:
    def __init__(self):
        self.head = self.tail = None
        self.length = 0

    @classmethod
    def from_iterable(cls, values):
        result = cls()
        for value in values:
            result.append(value)
        return result

    @property
    def size(self):
        return self.length

    @property
    def first(self):
        return self.head.value if self.head else None

    @property
    def last(self):
        return self.tail.value if self.tail else None

    def append(self, value):
        node = LinkedListNode(value)
        if self.tail:
            self.tail.next = node
        else:
            self.head = node
        self.tail = node
        self.length += 1
        return self

    def prepend(self, value):
        node = LinkedListNode(value)
        node.next = self.head
        self.head = node
        if self.tail is None:
            self.tail = node
        self.length += 1
        return self

    def _node_at(self, index):
        node = self.head
        for _ in range(index):
            node = node.next
        return node

    def insert_at(self, index, value):
        if index < 0 or index > self.length:
            raise IndexError(f'Index {index} is out of bounds')
        if index == 0:
            return self.prepend(value)
        if index == self.length:
            return self.append(value)
        previous, node = self._node_at(index - 1), LinkedListNode(value)
        node.next, previous.next = previous.next, node
        self.length += 1
        return self

    def get(self, index):
        return None if index < 0 or index >= self.length else self._node_at(index).value

    def index_of(self, value):
        for index, item in enumerate(self):
            if item == value:
                return index
        return -1

    def find(self, predicate):
        for value in self:
            if predicate(value):
                return value
        return None

    def remove_at(self, index):
        if index < 0 or index >= self.length:
            return None
        if index == 0:
            removed = self.head
            self.head = removed.next
            if self.head is None:
                self.tail = None
        else:
            previous = self._node_at(index - 1)
            removed = previous.next
            previous.next = removed.next
            if removed is self.tail:
                self.tail = previous
        self.length -= 1
        return removed.value

    def remove(self, value):
        index = self.index_of(value)
        if index == -1:
            return False
        self.remove_at(index)
        return True

    def reverse(self):
        previous, current = None, self.head
        self.tail = current
        while current:
            next_node = current.next
            current.next = previous
            previous, current = current, next_node
        self.head = previous
        return self

    def to_array(self):
        return list(self)

    def __iter__(self):
        node = self.head
        while node:
            yield node.value
            node = node.next
