from ...shared.compare import default_compare


class _Node:
    def __init__(self):
        self.keys, self.children = [], []

    @property
    def is_leaf(self):
        return not self.children


class BTree:
    def __init__(self, min_degree=2, compare=default_compare):
        if not isinstance(min_degree, int) or min_degree < 2:
            raise ValueError('Minimum degree must be an integer >= 2')
        self.min_degree, self.compare, self.root, self.count = min_degree, compare, _Node(), 0

    @property
    def size(self):
        return self.count

    def height(self):
        height, node = 1, self.root
        while not node.is_leaf:
            node = node.children[0]
            height += 1
        return height

    def _lower_index(self, node, value):
        low, high = 0, len(node.keys)
        while low < high:
            mid = (low + high) // 2
            if self.compare(node.keys[mid], value) < 0:
                low = mid + 1
            else:
                high = mid
        return low

    def has(self, value):
        node = self.root
        while True:
            index = self._lower_index(node, value)
            if index < len(node.keys) and self.compare(node.keys[index], value) == 0:
                return True
            if node.is_leaf:
                return False
            node = node.children[index]

    def insert(self, value):
        if self.has(value):
            return False
        if len(self.root.keys) == 2 * self.min_degree - 1:
            new_root = _Node()
            new_root.children.append(self.root)
            self._split_child(new_root, 0)
            self.root = new_root
        self._insert_non_full(self.root, value)
        self.count += 1
        return True

    def _split_child(self, parent, index):
        full, right = parent.children[index], _Node()
        right.keys = full.keys[self.min_degree:]
        median = full.keys[self.min_degree - 1]
        full.keys = full.keys[:self.min_degree - 1]
        if not full.is_leaf:
            right.children = full.children[self.min_degree:]
            full.children = full.children[:self.min_degree]
        parent.keys.insert(index, median)
        parent.children.insert(index + 1, right)

    def _insert_non_full(self, node, value):
        index = self._lower_index(node, value)
        if node.is_leaf:
            node.keys.insert(index, value)
            return
        if len(node.children[index].keys) == 2 * self.min_degree - 1:
            self._split_child(node, index)
            if self.compare(value, node.keys[index]) > 0:
                index += 1
        self._insert_non_full(node.children[index], value)

    def delete(self, value):
        if not self.has(value):
            return False
        self._remove(self.root, value)
        if not self.root.keys and not self.root.is_leaf:
            self.root = self.root.children[0]
        self.count -= 1
        return True

    def _remove(self, node, value):
        t, index = self.min_degree, self._lower_index(node, value)
        if index < len(node.keys) and self.compare(node.keys[index], value) == 0:
            if node.is_leaf:
                node.keys.pop(index)
                return
            left, right = node.children[index:index + 2]
            if len(left.keys) >= t:
                predecessor_node = left
                while not predecessor_node.is_leaf:
                    predecessor_node = predecessor_node.children[-1]
                predecessor = predecessor_node.keys[-1]
                node.keys[index] = predecessor
                self._remove(left, predecessor)
            elif len(right.keys) >= t:
                successor_node = right
                while not successor_node.is_leaf:
                    successor_node = successor_node.children[0]
                successor = successor_node.keys[0]
                node.keys[index] = successor
                self._remove(right, successor)
            else:
                self._merge(node, index)
                self._remove(left, value)
            return
        if node.is_leaf:
            return
        child = node.children[index]
        if len(child.keys) < t:
            left = node.children[index - 1] if index > 0 else None
            right = node.children[index + 1] if index + 1 < len(node.children) else None
            if left and len(left.keys) >= t:
                child.keys.insert(0, node.keys[index - 1])
                node.keys[index - 1] = left.keys.pop()
                if not left.is_leaf:
                    child.children.insert(0, left.children.pop())
            elif right and len(right.keys) >= t:
                child.keys.append(node.keys[index])
                node.keys[index] = right.keys.pop(0)
                if not right.is_leaf:
                    child.children.append(right.children.pop(0))
            elif right:
                self._merge(node, index)
            else:
                self._merge(node, index - 1)
                child = node.children[index - 1]
        self._remove(child, value)

    def _merge(self, node, index):
        left, right = node.children[index:index + 2]
        left.keys.append(node.keys.pop(index))
        left.keys.extend(right.keys)
        left.children.extend(right.children)
        node.children.pop(index + 1)

    def _walk(self, node):
        for i, key in enumerate(node.keys):
            if not node.is_leaf:
                yield from self._walk(node.children[i])
            yield key
        if not node.is_leaf:
            yield from self._walk(node.children[len(node.keys)])

    def to_array(self):
        return list(self)

    def __iter__(self):
        return self._walk(self.root)
