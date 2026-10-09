import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CircularBuffer } from '../../data-structures/linear/circular-buffer.js';
import { Deque } from '../../data-structures/linear/deque.js';
import { DoublyLinkedList } from '../../data-structures/linear/doubly-linked-list.js';
import { LinkedList } from '../../data-structures/linear/linked-list.js';
import { Queue } from '../../data-structures/linear/queue.js';
import { SkipList } from '../../data-structures/linear/skip-list.js';
import { Stack } from '../../data-structures/linear/stack.js';
import { numericSort, randomInts } from '../helpers.js';
describe('LinkedList', () => {
    it('appends, prepends and inserts', () => {
        const list = LinkedList.from(['My', 'name']).prepend('Hi').append('Slim').insertAt(3, 'is');
        assert.deepEqual(list.toArray(), ['Hi', 'My', 'name', 'is', 'Slim']);
        assert.equal(list.size, 5);
        assert.equal(list.get(2), 'name');
        assert.equal(list.indexOf('is'), 3);
        assert.equal(list.find((word) => word.startsWith('S')), 'Slim');
    });
    it('removes and keeps tail consistent', () => {
        const list = LinkedList.from([1, 2, 3]);
        assert.equal(list.remove(3), true);
        list.append(4);
        assert.deepEqual(list.toArray(), [1, 2, 4]);
        assert.equal(list.removeAt(0), 1);
        assert.equal(list.remove(42), false);
        assert.equal(list.last, 4);
        list.removeAt(0);
        list.removeAt(0);
        assert.equal(list.size, 0);
        assert.equal(list.first, undefined);
        list.append(7);
        assert.deepEqual(list.toArray(), [7]);
    });
    it('reverses', () => {
        const list = LinkedList.from([1, 2, 3, 4]).reverse();
        assert.deepEqual(list.toArray(), [4, 3, 2, 1]);
        list.append(0);
        assert.deepEqual(list.toArray(), [4, 3, 2, 1, 0]);
    });
    it('throws on invalid insert index', () => {
        assert.throws(() => new LinkedList().insertAt(1, 'x'), RangeError);
    });
});
describe('DoublyLinkedList', () => {
    it('works from both ends', () => {
        const list = DoublyLinkedList.from([2, 3]);
        list.pushFront(1);
        list.pushBack(4);
        assert.deepEqual(list.toArray(), [1, 2, 3, 4]);
        assert.deepEqual([...list.reversed()], [4, 3, 2, 1]);
        assert.equal(list.popFront(), 1);
        assert.equal(list.popBack(), 4);
        assert.equal(list.remove(2), true);
        assert.deepEqual(list.toArray(), [3]);
        assert.equal(list.first, 3);
        assert.equal(list.last, 3);
    });
});
describe('Stack and Queue', () => {
    it('stack is LIFO', () => {
        const stack = new Stack().push(1).push(2).push(3);
        assert.equal(stack.peek(), 3);
        assert.deepEqual(stack.toArray(), [3, 2, 1]);
        assert.equal(stack.pop(), 3);
        assert.equal(stack.size, 2);
    });
    it('queue is FIFO and survives compaction', () => {
        const queue = new Queue();
        for (let i = 0; i < 100; i++)
            queue.enqueue(i);
        for (let i = 0; i < 60; i++)
            assert.equal(queue.dequeue(), i);
        queue.enqueue(100);
        assert.equal(queue.peek(), 60);
        assert.equal(queue.size, 41);
        assert.deepEqual(queue.toArray().slice(-2), [99, 100]);
    });
});
describe('Deque', () => {
    it('grows and preserves order', () => {
        const deque = new Deque(2);
        for (let i = 0; i < 10; i++) {
            deque.pushBack(i);
            deque.pushFront(-i - 1);
        }
        assert.equal(deque.size, 20);
        assert.equal(deque.peekFront(), -10);
        assert.equal(deque.peekBack(), 9);
        assert.equal(deque.at(-1), 9);
        assert.equal(deque.popFront(), -10);
        assert.equal(deque.popBack(), 9);
        assert.deepEqual(deque.toArray().slice(0, 3), [-9, -8, -7]);
    });
});
describe('CircularBuffer', () => {
    it('overwrites the oldest values', () => {
        const buffer = new CircularBuffer(3);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        assert.equal(buffer.push(4), 1);
        assert.deepEqual(buffer.toArray(), [2, 3, 4]);
        assert.equal(buffer.shift(), 2);
        assert.deepEqual(buffer.toArray(), [3, 4]);
    });
});
describe('SkipList', () => {
    it('behaves like a sorted set', () => {
        const list = new SkipList();
        const reference = new Set();
        for (const value of randomInts(500, 0, 200)) {
            assert.equal(list.insert(value), !reference.has(value));
            reference.add(value);
        }
        for (const value of randomInts(200, 0, 200, 7)) {
            assert.equal(list.delete(value), reference.delete(value));
        }
        assert.deepEqual(list.toArray(), numericSort([...reference]));
        assert.equal(list.size, reference.size);
        for (let i = 0; i <= 200; i++)
            assert.equal(list.has(i), reference.has(i));
    });
});
