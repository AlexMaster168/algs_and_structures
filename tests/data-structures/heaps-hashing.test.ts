import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BloomFilter } from '../../src/data-structures/hashing/bloom-filter.js';
import { HashTable } from '../../src/data-structures/hashing/hash-table.js';
import { LRUCache } from '../../src/data-structures/hashing/lru-cache.js';
import { OpenAddressingHashMap } from '../../src/data-structures/hashing/open-addressing-hash-map.js';
import { BinaryHeap, MaxHeap, MinHeap } from '../../src/data-structures/heaps/binary-heap.js';
import { PriorityQueue } from '../../src/data-structures/heaps/priority-queue.js';
import { numericSort, randomInts } from '../helpers.js';

describe('BinaryHeap', () => {
  it('pops in sorted order', () => {
    const values = randomInts(300, -1000, 1000);
    const heap = new MinHeap(values);
    const popped: number[] = [];
    while (!heap.isEmpty()) popped.push(heap.pop()!);
    assert.deepEqual(popped, numericSort(values));
  });

  it('supports max heap and custom comparators', () => {
    const heap = new MaxHeap([3, 1, 4, 1, 5, 9, 2, 6]);
    assert.equal(heap.peek(), 9);
    assert.deepEqual(heap.toSortedArray(), [9, 6, 5, 4, 3, 2, 1, 1]);

    const byLength = new BinaryHeap<string>((a, b) => a.length - b.length).push('ccc', 'a', 'bb');
    assert.equal(byLength.pop(), 'a');
    assert.equal(byLength.pushPop('z'), 'z');
    assert.equal(byLength.pushPop('dddd'), 'bb');
  });

  it('priority queue keeps insertion order for equal priorities', () => {
    const queue = new PriorityQueue<string>().enqueue('low', 5).enqueue('first', 1).enqueue('second', 1);
    assert.equal(queue.peekPriority(), 1);
    assert.deepEqual([queue.dequeue(), queue.dequeue(), queue.dequeue(), queue.dequeue()], ['first', 'second', 'low', undefined]);
  });
});

describe('Hash maps', () => {
  for (const [name, create] of [
    ['HashTable', () => new HashTable<string | number, number>(undefined, 2)],
    ['OpenAddressingHashMap', () => new OpenAddressingHashMap<string | number, number>(undefined, 2)],
  ] as const) {
    it(`${name} matches Map behaviour`, () => {
      const map = create();
      const reference = new Map<string | number, number>();
      const keys = randomInts(2000, 0, 300);

      keys.forEach((key, i) => {
        const k = i % 3 === 0 ? `k${key}` : key;
        if (i % 5 === 0) assert.equal(map.delete(k), reference.delete(k));
        else {
          map.set(k, i);
          reference.set(k, i);
        }
      });

      assert.equal(map.size, reference.size);
      for (const [key, value] of reference) assert.equal(map.get(key), value);
      assert.equal(map.has('missing'), false);
      assert.equal(new Map([...map]).size, reference.size);
    });
  }

  it('distinguishes 1 and "1"', () => {
    const table = new HashTable<string | number, string>().set(1, 'number').set('1', 'string');
    assert.equal(table.get(1), 'number');
    assert.equal(table.get('1'), 'string');
  });
});

describe('BloomFilter', () => {
  it('has no false negatives and a low false positive rate', () => {
    const filter = new BloomFilter(1000, 0.01);
    for (let i = 0; i < 1000; i++) filter.add(`item-${i}`);
    for (let i = 0; i < 1000; i++) assert.equal(filter.mightContain(`item-${i}`), true);

    let falsePositives = 0;
    for (let i = 0; i < 10000; i++) if (filter.mightContain(`other-${i}`)) falsePositives++;
    assert.ok(falsePositives / 10000 < 0.03, `false positive rate ${falsePositives / 10000}`);
  });
});

describe('LRUCache', () => {
  it('evicts the least recently used key', () => {
    const cache = new LRUCache<string, number>(2);
    cache.set('a', 1).set('b', 2);
    assert.equal(cache.get('a'), 1);
    cache.set('c', 3);
    assert.equal(cache.has('b'), false);
    assert.deepEqual(cache.keys(), ['c', 'a']);
    cache.set('a', 10);
    cache.set('d', 4);
    assert.deepEqual(cache.keys(), ['d', 'a']);
    assert.equal(cache.get('a'), 10);
    assert.equal(cache.delete('a'), true);
    assert.equal(cache.size, 1);
  });
});
