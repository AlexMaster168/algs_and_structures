import { defaultCompare } from '../../shared/compare.js';
class AVLNode {
    value;
    left = null;
    right = null;
    height = 1;
    constructor(value) {
        this.value = value;
    }
}
const heightOf = (node) => node?.height ?? 0;
const balanceOf = (node) => heightOf(node.left) - heightOf(node.right);
const refresh = (node) => {
    node.height = 1 + Math.max(heightOf(node.left), heightOf(node.right));
};
const rotateRight = (node) => {
    const pivot = node.left;
    node.left = pivot.right;
    pivot.right = node;
    refresh(node);
    refresh(pivot);
    return pivot;
};
const rotateLeft = (node) => {
    const pivot = node.right;
    node.right = pivot.left;
    pivot.left = node;
    refresh(node);
    refresh(pivot);
    return pivot;
};
const rebalance = (node) => {
    refresh(node);
    const balance = balanceOf(node);
    if (balance > 1) {
        if (balanceOf(node.left) < 0)
            node.left = rotateLeft(node.left);
        return rotateRight(node);
    }
    if (balance < -1) {
        if (balanceOf(node.right) > 0)
            node.right = rotateRight(node.right);
        return rotateLeft(node);
    }
    return node;
};
export class AVLTree {
    compare;
    root = null;
    count = 0;
    constructor(compare = defaultCompare) {
        this.compare = compare;
    }
    get size() {
        return this.count;
    }
    height() {
        return heightOf(this.root);
    }
    has(value) {
        let current = this.root;
        while (current) {
            const order = this.compare(value, current.value);
            if (order === 0)
                return true;
            current = order < 0 ? current.left : current.right;
        }
        return false;
    }
    insert(value) {
        if (this.has(value))
            return false;
        this.root = this.insertInto(this.root, value);
        this.count++;
        return true;
    }
    delete(value) {
        if (!this.has(value))
            return false;
        this.root = this.removeFrom(this.root, value);
        this.count--;
        return true;
    }
    isBalanced() {
        const check = (node) => !node || (Math.abs(balanceOf(node)) <= 1 && check(node.left) && check(node.right));
        return check(this.root);
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        const stack = [];
        let current = this.root;
        while (current || stack.length) {
            while (current) {
                stack.push(current);
                current = current.left;
            }
            const node = stack.pop();
            yield node.value;
            current = node.right;
        }
    }
    insertInto(node, value) {
        if (!node)
            return new AVLNode(value);
        if (this.compare(value, node.value) < 0)
            node.left = this.insertInto(node.left, value);
        else
            node.right = this.insertInto(node.right, value);
        return rebalance(node);
    }
    removeFrom(node, value) {
        if (!node)
            return null;
        const order = this.compare(value, node.value);
        if (order < 0)
            node.left = this.removeFrom(node.left, value);
        else if (order > 0)
            node.right = this.removeFrom(node.right, value);
        else {
            if (!node.left || !node.right)
                return node.left ?? node.right;
            let successor = node.right;
            while (successor.left)
                successor = successor.left;
            node.value = successor.value;
            node.right = this.removeFrom(node.right, successor.value);
        }
        return rebalance(node);
    }
}
