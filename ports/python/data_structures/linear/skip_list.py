import random
from ...shared.compare import default_compare


class _Node:
    def __init__(self, value, level):
        self.value, self.next = value, [None] * level


class SkipList:
    def __init__(self, compare=default_compare, max_level=32, probability=0.5):
        if max_level < 1 or not 0 <= probability <= 1:
            raise ValueError('Invalid skip list configuration')
        self.compare, self.max_level, self.probability = compare, max_level, probability
        self.head, self.level, self.length = _Node(None, max_level), 1, 0

    @property
    def size(self):
        return self.length

    def _find_predecessors(self, value):
        update, node = [None] * self.max_level, self.head
        for i in range(self.level - 1, -1, -1):
            while node.next[i] and self.compare(node.next[i].value, value) < 0:
                node = node.next[i]
            update[i] = node
        return update

    def has(self, value):
        candidate = self._find_predecessors(value)[0].next[0]
        return candidate is not None and self.compare(candidate.value, value) == 0

    def insert(self, value):
        update = self._find_predecessors(value)
        candidate = update[0].next[0]
        if candidate and self.compare(candidate.value, value) == 0:
            return False
        level = 1
        while level < self.max_level and random.random() < self.probability:
            level += 1
        if level > self.level:
            for i in range(self.level, level):
                update[i] = self.head
            self.level = level
        node = _Node(value, level)
        for i in range(level):
            node.next[i] = update[i].next[i]
            update[i].next[i] = node
        self.length += 1
        return True

    def delete(self, value):
        update = self._find_predecessors(value)
        target = update[0].next[0]
        if target is None or self.compare(target.value, value) != 0:
            return False
        for i in range(self.level):
            if update[i].next[i] is not target:
                break
            update[i].next[i] = target.next[i]
        while self.level > 1 and self.head.next[self.level - 1] is None:
            self.level -= 1
        self.length -= 1
        return True

    def to_array(self):
        return list(self)

    def __iter__(self):
        node = self.head.next[0]
        while node:
            yield node.value
            node = node.next[0]
