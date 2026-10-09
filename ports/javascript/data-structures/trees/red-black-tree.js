import { defaultCompare } from '../../shared/compare.js';
class RBNode {
    value;
    color;
    left;
    right;
    parent;
    constructor(value, color, nil) {
        this.value = value;
        this.color = color;
        this.left = this.right = this.parent = nil ?? this;
    }
}
export class RedBlackTree {
    compare;
    nil = new RBNode(undefined, 'black');
    root = this.nil;
    count = 0;
    constructor(compare = defaultCompare) {
        this.compare = compare;
    }
    get size() {
        return this.count;
    }
    has(value) {
        return this.search(value) !== this.nil;
    }
    insert(value) {
        let parent = this.nil;
        let current = this.root;
        while (current !== this.nil) {
            parent = current;
            const order = this.compare(value, current.value);
            if (order === 0)
                return false;
            current = order < 0 ? current.left : current.right;
        }
        const node = new RBNode(value, 'red', this.nil);
        node.parent = parent;
        if (parent === this.nil)
            this.root = node;
        else if (this.compare(value, parent.value) < 0)
            parent.left = node;
        else
            parent.right = node;
        this.fixInsert(node);
        this.count++;
        return true;
    }
    delete(value) {
        const target = this.search(value);
        if (target === this.nil)
            return false;
        let removed = target;
        let removedColor = removed.color;
        let replacement;
        if (target.left === this.nil) {
            replacement = target.right;
            this.transplant(target, target.right);
        }
        else if (target.right === this.nil) {
            replacement = target.left;
            this.transplant(target, target.left);
        }
        else {
            removed = this.minimum(target.right);
            removedColor = removed.color;
            replacement = removed.right;
            if (removed.parent === target)
                replacement.parent = removed;
            else {
                this.transplant(removed, removed.right);
                removed.right = target.right;
                removed.right.parent = removed;
            }
            this.transplant(target, removed);
            removed.left = target.left;
            removed.left.parent = removed;
            removed.color = target.color;
        }
        if (removedColor === 'black')
            this.fixDelete(replacement);
        this.count--;
        return true;
    }
    height() {
        const measure = (node) => node === this.nil ? 0 : 1 + Math.max(measure(node.left), measure(node.right));
        return measure(this.root);
    }
    isValid() {
        if (this.root.color !== 'black')
            return false;
        const blackHeight = (node) => {
            if (node === this.nil)
                return 1;
            if (node.color === 'red' && (node.left.color === 'red' || node.right.color === 'red'))
                return -1;
            const left = blackHeight(node.left);
            const right = blackHeight(node.right);
            if (left === -1 || right === -1 || left !== right)
                return -1;
            return left + (node.color === 'black' ? 1 : 0);
        };
        return blackHeight(this.root) !== -1;
    }
    toArray() {
        return [...this];
    }
    *[Symbol.iterator]() {
        const stack = [];
        let current = this.root;
        while (current !== this.nil || stack.length) {
            while (current !== this.nil) {
                stack.push(current);
                current = current.left;
            }
            const node = stack.pop();
            yield node.value;
            current = node.right;
        }
    }
    search(value) {
        let current = this.root;
        while (current !== this.nil) {
            const order = this.compare(value, current.value);
            if (order === 0)
                return current;
            current = order < 0 ? current.left : current.right;
        }
        return this.nil;
    }
    minimum(node) {
        while (node.left !== this.nil)
            node = node.left;
        return node;
    }
    transplant(target, replacement) {
        if (target.parent === this.nil)
            this.root = replacement;
        else if (target === target.parent.left)
            target.parent.left = replacement;
        else
            target.parent.right = replacement;
        replacement.parent = target.parent;
    }
    rotateLeft(node) {
        const pivot = node.right;
        node.right = pivot.left;
        if (pivot.left !== this.nil)
            pivot.left.parent = node;
        pivot.parent = node.parent;
        if (node.parent === this.nil)
            this.root = pivot;
        else if (node === node.parent.left)
            node.parent.left = pivot;
        else
            node.parent.right = pivot;
        pivot.left = node;
        node.parent = pivot;
    }
    rotateRight(node) {
        const pivot = node.left;
        node.left = pivot.right;
        if (pivot.right !== this.nil)
            pivot.right.parent = node;
        pivot.parent = node.parent;
        if (node.parent === this.nil)
            this.root = pivot;
        else if (node === node.parent.right)
            node.parent.right = pivot;
        else
            node.parent.left = pivot;
        pivot.right = node;
        node.parent = pivot;
    }
    fixInsert(node) {
        while (node.parent.color === 'red') {
            const parent = node.parent;
            const grandparent = parent.parent;
            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                if (uncle.color === 'red') {
                    parent.color = uncle.color = 'black';
                    grandparent.color = 'red';
                    node = grandparent;
                    continue;
                }
                if (node === parent.right) {
                    node = parent;
                    this.rotateLeft(node);
                }
                node.parent.color = 'black';
                grandparent.color = 'red';
                this.rotateRight(grandparent);
            }
            else {
                const uncle = grandparent.left;
                if (uncle.color === 'red') {
                    parent.color = uncle.color = 'black';
                    grandparent.color = 'red';
                    node = grandparent;
                    continue;
                }
                if (node === parent.left) {
                    node = parent;
                    this.rotateRight(node);
                }
                node.parent.color = 'black';
                grandparent.color = 'red';
                this.rotateLeft(grandparent);
            }
        }
        this.root.color = 'black';
    }
    fixDelete(node) {
        while (node !== this.root && node.color === 'black') {
            if (node === node.parent.left) {
                let sibling = node.parent.right;
                if (sibling.color === 'red') {
                    sibling.color = 'black';
                    node.parent.color = 'red';
                    this.rotateLeft(node.parent);
                    sibling = node.parent.right;
                }
                if (sibling.left.color === 'black' && sibling.right.color === 'black') {
                    sibling.color = 'red';
                    node = node.parent;
                }
                else {
                    if (sibling.right.color === 'black') {
                        sibling.left.color = 'black';
                        sibling.color = 'red';
                        this.rotateRight(sibling);
                        sibling = node.parent.right;
                    }
                    sibling.color = node.parent.color;
                    node.parent.color = 'black';
                    sibling.right.color = 'black';
                    this.rotateLeft(node.parent);
                    node = this.root;
                }
            }
            else {
                let sibling = node.parent.left;
                if (sibling.color === 'red') {
                    sibling.color = 'black';
                    node.parent.color = 'red';
                    this.rotateRight(node.parent);
                    sibling = node.parent.left;
                }
                if (sibling.left.color === 'black' && sibling.right.color === 'black') {
                    sibling.color = 'red';
                    node = node.parent;
                }
                else {
                    if (sibling.left.color === 'black') {
                        sibling.right.color = 'black';
                        sibling.color = 'red';
                        this.rotateLeft(sibling);
                        sibling = node.parent.left;
                    }
                    sibling.color = node.parent.color;
                    node.parent.color = 'black';
                    sibling.left.color = 'black';
                    this.rotateRight(node.parent);
                    node = this.root;
                }
            }
        }
        node.color = 'black';
    }
}
