from ...shared.compare import default_compare


class _Node:
    def __init__(self, value, color, nil=None):
        self.value, self.color = value, color
        self.left = self.right = self.parent = self if nil is None else nil


class RedBlackTree:
    def __init__(self, compare=default_compare):
        self.compare, self.nil, self.count = compare, _Node(None, 'black'), 0
        self.root = self.nil

    @property
    def size(self):
        return self.count

    def _search(self, value):
        current = self.root
        while current is not self.nil:
            order = self.compare(value, current.value)
            if order == 0:
                return current
            current = current.left if order < 0 else current.right
        return self.nil

    def has(self, value):
        return self._search(value) is not self.nil

    def insert(self, value):
        parent, current = self.nil, self.root
        while current is not self.nil:
            parent = current
            order = self.compare(value, current.value)
            if order == 0:
                return False
            current = current.left if order < 0 else current.right
        node = _Node(value, 'red', self.nil)
        node.parent = parent
        if parent is self.nil:
            self.root = node
        elif self.compare(value, parent.value) < 0:
            parent.left = node
        else:
            parent.right = node
        self._fix_insert(node)
        self.count += 1
        return True

    def _transplant(self, target, replacement):
        if target.parent is self.nil:
            self.root = replacement
        elif target is target.parent.left:
            target.parent.left = replacement
        else:
            target.parent.right = replacement
        replacement.parent = target.parent

    def delete(self, value):
        target = self._search(value)
        if target is self.nil:
            return False
        removed, removed_color = target, target.color
        if target.left is self.nil:
            replacement = target.right
            self._transplant(target, target.right)
        elif target.right is self.nil:
            replacement = target.left
            self._transplant(target, target.left)
        else:
            removed = target.right
            while removed.left is not self.nil:
                removed = removed.left
            removed_color, replacement = removed.color, removed.right
            if removed.parent is target:
                replacement.parent = removed
            else:
                self._transplant(removed, removed.right)
                removed.right = target.right
                removed.right.parent = removed
            self._transplant(target, removed)
            removed.left = target.left
            removed.left.parent = removed
            removed.color = target.color
        if removed_color == 'black':
            self._fix_delete(replacement)
        self.count -= 1
        return True

    def _rotate_left(self, node):
        pivot = node.right
        node.right = pivot.left
        if pivot.left is not self.nil:
            pivot.left.parent = node
        pivot.parent = node.parent
        if node.parent is self.nil:
            self.root = pivot
        elif node is node.parent.left:
            node.parent.left = pivot
        else:
            node.parent.right = pivot
        pivot.left, node.parent = node, pivot

    def _rotate_right(self, node):
        pivot = node.left
        node.left = pivot.right
        if pivot.right is not self.nil:
            pivot.right.parent = node
        pivot.parent = node.parent
        if node.parent is self.nil:
            self.root = pivot
        elif node is node.parent.right:
            node.parent.right = pivot
        else:
            node.parent.left = pivot
        pivot.right, node.parent = node, pivot

    def _fix_insert(self, node):
        while node.parent.color == 'red':
            parent, grandparent = node.parent, node.parent.parent
            if parent is grandparent.left:
                uncle = grandparent.right
                if uncle.color == 'red':
                    parent.color = uncle.color = 'black'
                    grandparent.color = 'red'
                    node = grandparent
                    continue
                if node is parent.right:
                    node = parent
                    self._rotate_left(node)
                node.parent.color, grandparent.color = 'black', 'red'
                self._rotate_right(grandparent)
            else:
                uncle = grandparent.left
                if uncle.color == 'red':
                    parent.color = uncle.color = 'black'
                    grandparent.color = 'red'
                    node = grandparent
                    continue
                if node is parent.left:
                    node = parent
                    self._rotate_right(node)
                node.parent.color, grandparent.color = 'black', 'red'
                self._rotate_left(grandparent)
        self.root.color = 'black'

    def _fix_delete(self, node):
        while node is not self.root and node.color == 'black':
            if node is node.parent.left:
                sibling = node.parent.right
                if sibling.color == 'red':
                    sibling.color, node.parent.color = 'black', 'red'
                    self._rotate_left(node.parent)
                    sibling = node.parent.right
                if sibling.left.color == 'black' and sibling.right.color == 'black':
                    sibling.color = 'red'
                    node = node.parent
                else:
                    if sibling.right.color == 'black':
                        sibling.left.color, sibling.color = 'black', 'red'
                        self._rotate_right(sibling)
                        sibling = node.parent.right
                    sibling.color = node.parent.color
                    node.parent.color = sibling.right.color = 'black'
                    self._rotate_left(node.parent)
                    node = self.root
            else:
                sibling = node.parent.left
                if sibling.color == 'red':
                    sibling.color, node.parent.color = 'black', 'red'
                    self._rotate_right(node.parent)
                    sibling = node.parent.left
                if sibling.left.color == 'black' and sibling.right.color == 'black':
                    sibling.color = 'red'
                    node = node.parent
                else:
                    if sibling.left.color == 'black':
                        sibling.right.color, sibling.color = 'black', 'red'
                        self._rotate_left(sibling)
                        sibling = node.parent.left
                    sibling.color = node.parent.color
                    node.parent.color = sibling.left.color = 'black'
                    self._rotate_right(node.parent)
                    node = self.root
        node.color = 'black'

    def height(self):
        def measure(node):
            return 0 if node is self.nil else 1 + max(measure(node.left), measure(node.right))
        return measure(self.root)

    def is_valid(self):
        if self.root.color != 'black':
            return False

        def black_height(node):
            if node is self.nil:
                return 1
            if node.color == 'red' and (node.left.color == 'red' or node.right.color == 'red'):
                return -1
            left, right = black_height(node.left), black_height(node.right)
            if left == -1 or right == -1 or left != right:
                return -1
            return left + (node.color == 'black')

        return black_height(self.root) != -1

    def to_array(self):
        return list(self)

    def __iter__(self):
        stack, current = [], self.root
        while current is not self.nil or stack:
            while current is not self.nil:
                stack.append(current)
                current = current.left
            node = stack.pop()
            yield node.value
            current = node.right
