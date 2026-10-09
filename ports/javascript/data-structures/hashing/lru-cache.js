import { DoublyLinkedList } from '../linear/doubly-linked-list.js';
export class LRUCache {
    capacity;
    nodes = new Map();
    order = new DoublyLinkedList();
    constructor(capacity) {
        this.capacity = capacity;
        if (!Number.isInteger(capacity) || capacity <= 0)
            throw new RangeError('Capacity must be a positive integer');
    }
    get size() {
        return this.nodes.size;
    }
    get(key) {
        const node = this.nodes.get(key);
        if (!node)
            return undefined;
        this.touch(key, node.value[1], node);
        return node.value[1];
    }
    has(key) {
        return this.nodes.has(key);
    }
    set(key, value) {
        const existing = this.nodes.get(key);
        this.touch(key, value, existing);
        if (this.nodes.size > this.capacity) {
            const [oldestKey] = this.order.popBack();
            this.nodes.delete(oldestKey);
        }
        return this;
    }
    delete(key) {
        const node = this.nodes.get(key);
        if (!node)
            return false;
        this.order.unlink(node);
        return this.nodes.delete(key);
    }
    keys() {
        return this.order.toArray().map(([key]) => key);
    }
    touch(key, value, node) {
        if (node)
            this.order.unlink(node);
        this.nodes.set(key, this.order.pushFront([key, value]));
    }
}
