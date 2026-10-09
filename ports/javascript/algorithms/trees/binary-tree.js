export const treeNode = (value, left = null, right = null) => ({
    value,
    left,
    right,
});
export const fromLevelOrder = (values) => {
    if (values.length === 0 || values[0] === null)
        return null;
    const root = treeNode(values[0]);
    const queue = [root];
    let i = 1;
    for (let head = 0; head < queue.length && i < values.length; head++) {
        const node = queue[head];
        for (const side of ['left', 'right']) {
            const value = values[i++];
            if (value === null || value === undefined)
                continue;
            node[side] = treeNode(value);
            queue.push(node[side]);
        }
    }
    return root;
};
export const preOrder = (root) => {
    const result = [];
    const stack = root ? [root] : [];
    while (stack.length) {
        const node = stack.pop();
        result.push(node.value);
        if (node.right)
            stack.push(node.right);
        if (node.left)
            stack.push(node.left);
    }
    return result;
};
export const inOrder = (root) => {
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        const node = stack.pop();
        result.push(node.value);
        current = node.right;
    }
    return result;
};
export const postOrder = (root) => {
    const result = [];
    const stack = root ? [root] : [];
    while (stack.length) {
        const node = stack.pop();
        result.push(node.value);
        if (node.left)
            stack.push(node.left);
        if (node.right)
            stack.push(node.right);
    }
    return result.reverse();
};
export const levelOrder = (root) => {
    const levels = [];
    let level = root ? [root] : [];
    while (level.length) {
        levels.push(level.map((node) => node.value));
        level = level.flatMap((node) => [node.left, node.right].filter((child) => child !== null));
    }
    return levels;
};
export const maxDepth = (root) => root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0;
export const maxValue = (root) => {
    const values = preOrder(root);
    return values.length ? values.reduce((a, b) => (a > b ? a : b)) : null;
};
export const isValidBst = (root, low = -Infinity, high = Infinity) => !root ||
    (root.value > low &&
        root.value < high &&
        isValidBst(root.left, low, root.value) &&
        isValidBst(root.right, root.value, high));
export const invertTree = (root) => {
    if (!root)
        return null;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
};
export const lowestCommonAncestorBst = (root, a, b) => {
    let current = root;
    while (current) {
        if (a < current.value && b < current.value)
            current = current.left;
        else if (a > current.value && b > current.value)
            current = current.right;
        else
            return current;
    }
    return null;
};
