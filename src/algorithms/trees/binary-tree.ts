export interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

export const treeNode = <T>(value: T, left: TreeNode<T> | null = null, right: TreeNode<T> | null = null): TreeNode<T> => ({
  value,
  left,
  right,
});

export const fromLevelOrder = <T>(values: readonly (T | null)[]): TreeNode<T> | null => {
  if (values.length === 0 || values[0] === null) return null;

  const root = treeNode(values[0] as T);
  const queue = [root];
  let i = 1;

  for (let head = 0; head < queue.length && i < values.length; head++) {
    const node = queue[head]!;
    for (const side of ['left', 'right'] as const) {
      const value = values[i++];
      if (value === null || value === undefined) continue;
      node[side] = treeNode(value);
      queue.push(node[side]);
    }
  }

  return root;
};

export const preOrder = <T>(root: TreeNode<T> | null): T[] => {
  const result: T[] = [];
  const stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node.value);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
};

export const inOrder = <T>(root: TreeNode<T> | null): T[] => {
  const result: T[] = [];
  const stack: TreeNode<T>[] = [];
  let current = root;
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    const node = stack.pop()!;
    result.push(node.value);
    current = node.right;
  }
  return result;
};

export const postOrder = <T>(root: TreeNode<T> | null): T[] => {
  const result: T[] = [];
  const stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node.value);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return result.reverse();
};

export const levelOrder = <T>(root: TreeNode<T> | null): T[][] => {
  const levels: T[][] = [];
  let level = root ? [root] : [];
  while (level.length) {
    levels.push(level.map((node) => node.value));
    level = level.flatMap((node) => [node.left, node.right].filter((child) => child !== null));
  }
  return levels;
};

export const maxDepth = <T>(root: TreeNode<T> | null): number =>
  root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0;

export const maxValue = (root: TreeNode<number> | null): number | null => {
  const values = preOrder(root);
  return values.length ? values.reduce((a, b) => (a > b ? a : b)) : null;
};

export const isValidBst = (root: TreeNode<number> | null, low = -Infinity, high = Infinity): boolean =>
  !root ||
  (root.value > low &&
    root.value < high &&
    isValidBst(root.left, low, root.value) &&
    isValidBst(root.right, root.value, high));

export const invertTree = <T>(root: TreeNode<T> | null): TreeNode<T> | null => {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
};

export const lowestCommonAncestorBst = (root: TreeNode<number> | null, a: number, b: number): TreeNode<number> | null => {
  let current = root;
  while (current) {
    if (a < current.value && b < current.value) current = current.left;
    else if (a > current.value && b > current.value) current = current.right;
    else return current;
  }
  return null;
};
