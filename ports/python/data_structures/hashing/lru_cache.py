from ..linear.doubly_linked_list import DoublyLinkedList


class LRUCache:
    def __init__(self, capacity):
        if not isinstance(capacity, int) or capacity <= 0:
            raise ValueError('Capacity must be a positive integer')
        self.capacity, self.nodes, self.order = capacity, {}, DoublyLinkedList()

    @property
    def size(self):
        return len(self.nodes)

    def _touch(self, key, value, node=None):
        if node is not None:
            self.order.unlink(node)
        self.nodes[key] = self.order.push_front((key, value))

    def get(self, key):
        node = self.nodes.get(key)
        if node is None:
            return None
        self._touch(key, node.value[1], node)
        return node.value[1]

    def has(self, key):
        return key in self.nodes

    def set(self, key, value):
        self._touch(key, value, self.nodes.get(key))
        if len(self.nodes) > self.capacity:
            oldest_key, _ = self.order.pop_back()
            del self.nodes[oldest_key]
        return self

    def delete(self, key):
        node = self.nodes.get(key)
        if node is None:
            return False
        self.order.unlink(node)
        del self.nodes[key]
        return True

    def keys(self):
        return [key for key, _ in self.order]
