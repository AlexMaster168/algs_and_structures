from dataclasses import dataclass


@dataclass
class TreeNode:
    value: object
    left: object = None
    right: object = None


def tree_node(value, left=None, right=None):
    return TreeNode(value, left, right)


def from_level_order(values):
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue, index = [root], 1
    for node in queue:
        for side in ('left', 'right'):
            if index >= len(values):
                return root
            value = values[index]
            index += 1
            if value is not None:
                child = TreeNode(value)
                setattr(node, side, child)
                queue.append(child)
    return root


def pre_order(root):
    stack, result = ([root] if root else []), []
    while stack:
        node = stack.pop()
        result.append(node.value)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return result


def in_order(root):
    stack, result, current = [], [], root
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.value)
        current = current.right
    return result


def post_order(root):
    stack, result = ([root] if root else []), []
    while stack:
        node = stack.pop()
        result.append(node.value)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return result[::-1]


def level_order(root):
    level, result = ([root] if root else []), []
    while level:
        result.append([node.value for node in level])
        level = [child for node in level for child in (node.left, node.right) if child]
    return result


def max_depth(root):
    return 1 + max(max_depth(root.left), max_depth(root.right)) if root else 0


def max_value(root):
    return max(pre_order(root), default=None)


def is_valid_bst(root, low=float('-inf'), high=float('inf')):
    return root is None or low < root.value < high and is_valid_bst(root.left, low, root.value) and is_valid_bst(root.right, root.value, high)


def invert_tree(root):
    if root:
        root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root


def lowest_common_ancestor_bst(root, a, b):
    while root:
        if max(a, b) < root.value:
            root = root.left
        elif min(a, b) > root.value:
            root = root.right
        else:
            return root
    return None
