import { type Comparator, defaultCompare } from '../../shared/compare.js';

class AVLNode<T> {
  left: AVLNode<T> | null = null;
  right: AVLNode<T> | null = null;
  height = 1;

  constructor(public value: T) {}
}

const heightOf = <T>(node: AVLNode<T> | null): number => node?.height ?? 0;

const balanceOf = <T>(node: AVLNode<T>): number => heightOf(node.left) - heightOf(node.right);

const refresh = <T>(node: AVLNode<T>): void => {
  node.height = 1 + Math.max(heightOf(node.left), heightOf(node.right));
};

const rotateRight = <T>(node: AVLNode<T>): AVLNode<T> => {
  const pivot = node.left!;
  node.left = pivot.right;
  pivot.right = node;
  refresh(node);
  refresh(pivot);
  return pivot;
};

const rotateLeft = <T>(node: AVLNode<T>): AVLNode<T> => {
  const pivot = node.right!;
  node.right = pivot.left;
  pivot.left = node;
  refresh(node);
  refresh(pivot);
  return pivot;
};

const rebalance = <T>(node: AVLNode<T>): AVLNode<T> => {
  refresh(node);
  const balance = balanceOf(node);

  if (balance > 1) {
    if (balanceOf(node.left!) < 0) node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }

  if (balance < -1) {
    if (balanceOf(node.right!) > 0) node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }

  return node;
};

export class AVLTree<T> implements Iterable<T> {
  private root: AVLNode<T> | null = null;
  private count = 0;

  constructor(private readonly compare: Comparator<T> = defaultCompare) {}

  get size(): number {
    return this.count;
  }

  height(): number {
    return heightOf(this.root);
  }

  has(value: T): boolean {
    let current = this.root;
    while (current) {
      const order = this.compare(value, current.value);
      if (order === 0) return true;
      current = order < 0 ? current.left : current.right;
    }
    return false;
  }

  insert(value: T): boolean {
    if (this.has(value)) return false;
    this.root = this.insertInto(this.root, value);
    this.count++;
    return true;
  }

  delete(value: T): boolean {
    if (!this.has(value)) return false;
    this.root = this.removeFrom(this.root, value);
    this.count--;
    return true;
  }

  isBalanced(): boolean {
    const check = (node: AVLNode<T> | null): boolean =>
      !node || (Math.abs(balanceOf(node)) <= 1 && check(node.left) && check(node.right));
    return check(this.root);
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    const stack: AVLNode<T>[] = [];
    let current = this.root;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      const node = stack.pop()!;
      yield node.value;
      current = node.right;
    }
  }

  private insertInto(node: AVLNode<T> | null, value: T): AVLNode<T> {
    if (!node) return new AVLNode(value);
    if (this.compare(value, node.value) < 0) node.left = this.insertInto(node.left, value);
    else node.right = this.insertInto(node.right, value);
    return rebalance(node);
  }

  private removeFrom(node: AVLNode<T> | null, value: T): AVLNode<T> | null {
    if (!node) return null;

    const order = this.compare(value, node.value);
    if (order < 0) node.left = this.removeFrom(node.left, value);
    else if (order > 0) node.right = this.removeFrom(node.right, value);
    else {
      if (!node.left || !node.right) return node.left ?? node.right;
      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.value = successor.value;
      node.right = this.removeFrom(node.right, successor.value);
    }

    return rebalance(node);
  }
}
