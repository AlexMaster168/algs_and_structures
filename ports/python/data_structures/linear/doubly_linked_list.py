class DoublyLinkedListNode:
    def __init__(self, value):
        self.value = value
        self.prev = self.next = None


class DoublyLinkedList:
    def __init__(self):
        self.head = self.tail = None
        self.length = 0

    @classmethod
    def from_iterable(cls, values):
        result = cls()
        for value in values:
            result.push_back(value)
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

    def push_back(self, value):
        node = DoublyLinkedListNode(value)
        node.prev = self.tail
        if self.tail:
            self.tail.next = node
        else:
            self.head = node
        self.tail = node
        self.length += 1
        return node

    def push_front(self, value):
        node = DoublyLinkedListNode(value)
        node.next = self.head
        if self.head:
            self.head.prev = node
        else:
            self.tail = node
        self.head = node
        self.length += 1
        return node

    def pop_back(self):
        if self.tail is None:
            return None
        node = self.tail
        self.unlink(node)
        return node.value

    def pop_front(self):
        if self.head is None:
            return None
        node = self.head
        self.unlink(node)
        return node.value

    def remove(self, value):
        node = self.head
        while node:
            if node.value == value:
                self.unlink(node)
                return True
            node = node.next
        return False

    def unlink(self, node):
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev
        node.prev = node.next = None
        self.length -= 1

    def to_array(self):
        return list(self)

    def reversed(self):
        node = self.tail
        while node:
            yield node.value
            node = node.prev

    def __iter__(self):
        node = self.head
        while node:
            yield node.value
            node = node.next
