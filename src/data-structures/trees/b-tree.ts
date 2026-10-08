import { type Comparator, defaultCompare } from '../../shared/compare.js';

class BTreeNode<T> {
  keys: T[] = [];
  children: BTreeNode<T>[] = [];

  get isLeaf(): boolean {
    return this.children.length === 0;
  }
}

export class BTree<T> implements Iterable<T> {
  private root = new BTreeNode<T>();
  private count = 0;

  constructor(
    readonly minDegree = 2,
    private readonly compare: Comparator<T> = defaultCompare,
  ) {
    if (!Number.isInteger(minDegree) || minDegree < 2) throw new RangeError('Minimum degree must be an integer >= 2');
  }

  get size(): number {
    return this.count;
  }

  height(): number {
    let height = 1;
    for (let node = this.root; !node.isLeaf; node = node.children[0]!) height++;
    return height;
  }

  has(value: T): boolean {
    let node = this.root;
    while (true) {
      const index = this.lowerIndex(node, value);
      if (index < node.keys.length && this.compare(node.keys[index]!, value) === 0) return true;
      if (node.isLeaf) return false;
      node = node.children[index]!;
    }
  }

  insert(value: T): boolean {
    if (this.has(value)) return false;

    if (this.root.keys.length === 2 * this.minDegree - 1) {
      const newRoot = new BTreeNode<T>();
      newRoot.children.push(this.root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, value);
    this.count++;
    return true;
  }

  delete(value: T): boolean {
    if (!this.has(value)) return false;

    this.remove(this.root, value);
    if (this.root.keys.length === 0 && !this.root.isLeaf) this.root = this.root.children[0]!;
    this.count--;
    return true;
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Generator<T> {
    yield* this.walk(this.root);
  }

  private *walk(node: BTreeNode<T>): Generator<T> {
    for (let i = 0; i < node.keys.length; i++) {
      if (!node.isLeaf) yield* this.walk(node.children[i]!);
      yield node.keys[i]!;
    }
    if (!node.isLeaf) yield* this.walk(node.children[node.keys.length]!);
  }

  private lowerIndex(node: BTreeNode<T>, value: T): number {
    let low = 0;
    let high = node.keys.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (this.compare(node.keys[mid]!, value) < 0) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  private splitChild(parent: BTreeNode<T>, index: number): void {
    const full = parent.children[index]!;
    const right = new BTreeNode<T>();

    right.keys = full.keys.splice(this.minDegree);
    const median = full.keys.pop()!;
    if (!full.isLeaf) right.children = full.children.splice(this.minDegree);

    parent.keys.splice(index, 0, median);
    parent.children.splice(index + 1, 0, right);
  }

  private insertNonFull(node: BTreeNode<T>, value: T): void {
    let index = this.lowerIndex(node, value);

    if (node.isLeaf) {
      node.keys.splice(index, 0, value);
      return;
    }

    if (node.children[index]!.keys.length === 2 * this.minDegree - 1) {
      this.splitChild(node, index);
      if (this.compare(value, node.keys[index]!) > 0) index++;
    }

    this.insertNonFull(node.children[index]!, value);
  }

  private remove(node: BTreeNode<T>, value: T): void {
    const t = this.minDegree;
    const index = this.lowerIndex(node, value);

    if (index < node.keys.length && this.compare(node.keys[index]!, value) === 0) {
      if (node.isLeaf) {
        node.keys.splice(index, 1);
        return;
      }

      const left = node.children[index]!;
      const right = node.children[index + 1]!;

      if (left.keys.length >= t) {
        const predecessor = this.maxKey(left);
        node.keys[index] = predecessor;
        this.remove(left, predecessor);
      } else if (right.keys.length >= t) {
        const successor = this.minKey(right);
        node.keys[index] = successor;
        this.remove(right, successor);
      } else {
        this.merge(node, index);
        this.remove(left, value);
      }
      return;
    }

    if (node.isLeaf) return;

    let child = node.children[index]!;
    if (child.keys.length < t) {
      const leftSibling = index > 0 ? node.children[index - 1] : undefined;
      const rightSibling = node.children[index + 1];

      if (leftSibling && leftSibling.keys.length >= t) {
        child.keys.unshift(node.keys[index - 1]!);
        node.keys[index - 1] = leftSibling.keys.pop()!;
        if (!leftSibling.isLeaf) child.children.unshift(leftSibling.children.pop()!);
      } else if (rightSibling && rightSibling.keys.length >= t) {
        child.keys.push(node.keys[index]!);
        node.keys[index] = rightSibling.keys.shift()!;
        if (!rightSibling.isLeaf) child.children.push(rightSibling.children.shift()!);
      } else if (rightSibling) {
        this.merge(node, index);
      } else {
        this.merge(node, index - 1);
        child = node.children[index - 1]!;
      }
    }

    this.remove(child, value);
  }

  private merge(node: BTreeNode<T>, index: number): void {
    const left = node.children[index]!;
    const right = node.children[index + 1]!;
    left.keys.push(node.keys[index]!, ...right.keys);
    left.children.push(...right.children);
    node.keys.splice(index, 1);
    node.children.splice(index + 1, 1);
  }

  private maxKey(node: BTreeNode<T>): T {
    while (!node.isLeaf) node = node.children[node.children.length - 1]!;
    return node.keys[node.keys.length - 1]!;
  }

  private minKey(node: BTreeNode<T>): T {
    while (!node.isLeaf) node = node.children[0]!;
    return node.keys[0]!;
  }
}
