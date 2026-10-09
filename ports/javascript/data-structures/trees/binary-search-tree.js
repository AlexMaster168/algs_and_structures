import { defaultCompare } from '../../shared/compare.js';
export class BSTNode {
    value;
    left = null;
    right = null;
    constructor(value) {
        this.value = value;
    }
}
export class BinarySearchTree {
    compare;
    root = null;
    count = 0;
    constructor(compare = defaultCompare) {
        this.compare = compare;
    }
    static from(values, compare) {
        const tree = new BinarySearchTree(compare);
        for (const value of values)
            tree.insert(value);
        return tree;
    }
    get size() {
        return this.count;
    }
    get rootNode() {
        return this.root;
    }
    insert(value) {
        const node = new BSTNode(value);
        if (!this.root) {
            this.root = node;
            this.count++;
            return true;
        }
        let current = this.root;
        while (true) {
            const order = this.compare(value, current.value);
            if (order === 0)
                return false;
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
    delete(value) {
        if (!this.has(value))
            return false;
        this.root = this.remove(this.root, value);
        this.count--;
        return true;
    }
    min() {
        let current = this.root;
        while (current?.left)
            current = current.left;
        return current?.value;
    }
    max() {
        let current = this.root;
        while (current?.right)
            current = current.right;
        return current?.value;
    }
    floor(value) {
        let current = this.root;
        let result;
        while (current) {
            const order = this.compare(value, current.value);
            if (order === 0)
                return current.value;
            if (order < 0)
                current = current.left;
            else {
                result = current.value;
                current = current.right;
            }
        }
        return result;
    }
    ceil(value) {
        let current = this.root;
        let result;
        while (current) {
            const order = this.compare(value, current.value);
            if (order === 0)
                return current.value;
            if (order > 0)
                current = current.right;
            else {
                result = current.value;
                current = current.left;
            }
        }
        return result;
    }
    height() {
        const measure = (node) => node ? 1 + Math.max(measure(node.left), measure(node.right)) : 0;
        return measure(this.root);
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
    remove(node, value) {
        if (!node)
            return null;
        const order = this.compare(value, node.value);
        if (order < 0) {
            node.left = this.remove(node.left, value);
            return node;
        }
        if (order > 0) {
            node.right = this.remove(node.right, value);
            return node;
        }
        if (!node.left)
            return node.right;
        if (!node.right)
            return node.left;
        let successor = node.right;
        while (successor.left)
            successor = successor.left;
        node.value = successor.value;
        node.right = this.remove(node.right, successor.value);
        return node;
    }
}
