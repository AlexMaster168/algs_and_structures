import { type Comparator, defaultCompare } from '../../shared/compare.js';

export class BSTNode<T> {
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;

  constructor(public value: T) {}
}

export class BinarySearchTree<T> implements Iterable<T> {
  private root: BSTNode<T> | null = null;
  private count = 0;

  constructor(private readonly compare: Comparator<T> = defaultCompare) {}

  static from<T>(values: Iterable<T>, compare?: Comparator<T>): BinarySearchTree<T> {
    const tree = new BinarySearchTree<T>(compare);
    for (const value of values) tree.insert(value);
    return tree;
  }

  get size(): number {
    return this.count;
  }

  get rootNode(): BSTNode<T> | null {
    return this.root;
  }

  insert(value: T): boolean {
    const node = new BSTNode(value);
    if (!this.root) {
      this.root = node;
      this.count++;
      return true;
    }

    let current = this.root;
    while (true) {
      const order = this.compare(value, current.value);
      if (order === 0) return false;

      const side = order < 0 ? 'left' : 'right';
      const next = current[side];
      if (!next) {
        current[side] = node;
        this.count++;
        return true;
      }
      current = next;
    }
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

  delete(value: T): boolean {
    if (!this.has(value)) return false;
    this.root = this.remove(this.root, value);
    this.count--;
    return true;
  }

  min(): T | undefined {
    let current = this.root;
    while (current?.left) current = current.left;
    return current?.value;
  }

  max(): T | undefined {
    let current = this.root;
    while (current?.right) current = current.right;
    return current?.value;
  }

  floor(value: T): T | undefined {
    let current = this.root;
    let result: T | undefined;
    while (current) {
      const order = this.compare(value, current.value);
      if (order === 0) return current.value;
      if (order < 0) current = current.left;
      else {
        result = current.value;
        current = current.right;
      }
    }
    return result;
  }

  ceil(value: T): T | undefined {
    let current = this.root;
    let result: T | undefined;
    while (current) {
      const order = this.compare(value, current.value);
      if (order === 0) return current.value;
      if (order > 0) current = current.right;
      else {
        result = current.value;
        current = current.left;
      }
    }
    return result;
  }

  height(): number {
    const measure = (node: BSTNode<T> | null): number =>
      node ? 1 + Math.max(measure(node.left), measure(node.right)) : 0;
    return measure(this.root);
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    const stack: BSTNode<T>[] = [];
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

  private remove(node: BSTNode<T> | null, value: T): BSTNode<T> | null {
    if (!node) return null;

    const order = this.compare(value, node.value);
    if (order < 0) {
      node.left = this.remove(node.left, value);
      return node;
    }
    if (order > 0) {
      node.right = this.remove(node.right, value);
      return node;
    }

    if (!node.left) return node.right;
    if (!node.right) return node.left;

    let successor = node.right;
    while (successor.left) successor = successor.left;
    node.value = successor.value;
    node.right = this.remove(node.right, successor.value);
    return node;
  }
}
