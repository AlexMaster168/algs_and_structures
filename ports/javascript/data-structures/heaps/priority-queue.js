import { BinaryHeap } from './binary-heap.js';
export class PriorityQueue {
    heap = new BinaryHeap((a, b) => a.priority - b.priority || a.order - b.order);
    counter = 0;
    get size() {
        return this.heap.size;
    }
    isEmpty() {
        return this.heap.isEmpty();
    }
    enqueue(value, priority) {
        this.heap.push({ value, priority, order: this.counter++ });
        return this;
    }
    dequeue() {
        return this.heap.pop()?.value;
    }
    peek() {
        return this.heap.peek()?.value;
    }
    peekPriority() {
        return this.heap.peek()?.priority;
    }
}
