from ...shared.compare import default_compare


class _Node:
    def __init__(self, value):
        self.value, self.height = value, 1
        self.left = self.right = None


def _height(node):
    return node.height if node else 0


def _balance(node):
    return _height(node.left) - _height(node.right)


def _refresh(node):
    node.height = 1 + max(_height(node.left), _height(node.right))


def _rotate_right(node):
    pivot = node.left
    node.left, pivot.right = pivot.right, node
    _refresh(node)
    _refresh(pivot)
    return pivot


def _rotate_left(node):
    pivot = node.right
    node.right, pivot.left = pivot.left, node
    _refresh(node)
    _refresh(pivot)
    return pivot


def _rebalance(node):
    _refresh(node)
    balance = _balance(node)
    if balance > 1:
        if _balance(node.left) < 0:
            node.left = _rotate_left(node.left)
        return _rotate_right(node)
    if balance < -1:
        if _balance(node.right) > 0:
            node.right = _rotate_right(node.right)
        return _rotate_left(node)
    return node


class AVLTree:
    def __init__(self, compare=default_compare):
        self.compare, self.root, self.count = compare, None, 0

    @property
    def size(self):
        return self.count

    def height(self):
        return _height(self.root)

    def has(self, value):
        current = self.root
        while current:
            order = self.compare(value, current.value)
            if order == 0:
                return True
            current = current.left if order < 0 else current.right
        return False

    def insert(self, value):
        if self.has(value):
            return False
        self.root = self._insert(self.root, value)
        self.count += 1
        return True

    def _insert(self, node, value):
        if node is None:
            return _Node(value)
        if self.compare(value, node.value) < 0:
            node.left = self._insert(node.left, value)
        else:
            node.right = self._insert(node.right, value)
        return _rebalance(node)

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
            if node.left is None or node.right is None:
                return node.left if node.left else node.right
            successor = node.right
            while successor.left:
                successor = successor.left
            node.value = successor.value
            node.right = self._remove(node.right, successor.value)
        return _rebalance(node)

    def is_balanced(self):
        def check(node):
            return node is None or abs(_balance(node)) <= 1 and check(node.left) and check(node.right)
        return check(self.root)

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
