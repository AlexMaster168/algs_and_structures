import { BinaryHeap } from './binary-heap.js';

interface Entry<T> {
  value: T;
  priority: number;
  order: number;
}

export class PriorityQueue<T> {
  private readonly heap = new BinaryHeap<Entry<T>>((a, b) => a.priority - b.priority || a.order - b.order);
  private counter = 0;

  get size(): number {
    return this.heap.size;
  }

  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  enqueue(value: T, priority: number): this {
    this.heap.push({ value, priority, order: this.counter++ });
    return this;
  }

  dequeue(): T | undefined {
    return this.heap.pop()?.value;
  }

  peek(): T | undefined {
    return this.heap.peek()?.value;
  }

  peekPriority(): number | undefined {
    return this.heap.peek()?.priority;
  }
}
