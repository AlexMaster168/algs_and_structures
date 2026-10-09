from ...shared.compare import default_compare


class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = self.right = None


class BinarySearchTree:
    def __init__(self, compare=default_compare):
        self.compare, self.root, self.count = compare, None, 0

    @classmethod
    def from_iterable(cls, values, compare=default_compare):
        tree = cls(compare)
        for value in values:
            tree.insert(value)
        return tree

    @property
    def size(self):
        return self.count

    @property
    def root_node(self):
        return self.root

    def insert(self, value):
        node = BSTNode(value)
        if self.root is None:
            self.root = node
            self.count += 1
            return True
        current = self.root
        while True:
            order = self.compare(value, current.value)
            if order == 0:
                return False
            side = 'left' if order < 0 else 'right'
            next_node = getattr(current, side)
            if next_node is None:
                setattr(current, side, node)
                self.count += 1
                return True
            current = next_node

    def has(self, value):
        current = self.root
        while current:
            order = self.compare(value, current.value)
            if order == 0:
                return True
            current = current.left if order < 0 else current.right
        return False

    def delete(self, value):
        if not self.has(value):
            return False
        self.root = self._remove(self.root, value)
        self.count -= 1
        return True

    def _remove(self, node, value):
        if node is None:
            return None
        order = self.compare(value, node.value)
        if order < 0:
            node.left = self._remove(node.left, value)
        elif order > 0:
            node.right = self._remove(node.right, value)
        else:
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left
            successor = node.right
            while successor.left:
                successor = successor.left
            node.value = successor.value
            node.right = self._remove(node.right, successor.value)
        return node

    def min(self):
        node = self.root
        while node and node.left:
            node = node.left
        return node.value if node else None

    def max(self):
        node = self.root
        while node and node.right:
            node = node.right
        return node.value if node else None

    def floor(self, value):
        current, result = self.root, None
        while current:
            order = self.compare(value, current.value)
            if order == 0:
                return current.value
            if order < 0:
                current = current.left
            else:
                result, current = current.value, current.right
        return result

    def ceil(self, value):
        current, result = self.root, None
        while current:
            order = self.compare(value, current.value)
            if order == 0:
                return current.value
            if order > 0:
                current = current.right
            else:
                result, current = current.value, current.left
        return result

    def height(self):
        def measure(node):
            return 1 + max(measure(node.left), measure(node.right)) if node else 0
        return measure(self.root)

    def to_array(self):
        return list(self)

    def __iter__(self):
        stack, current = [], self.root
        while current or stack:
            while current:
                stack.append(current)
                current = current.left
            node = stack.pop()
            yield node.value
            current = node.right
