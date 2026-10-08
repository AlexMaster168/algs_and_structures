import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { binarySearch, binarySearchRecursive, firstTrue, lowerBound, upperBound } from '../../src/algorithms/searching/binary-search.js';
import { exponentialSearch } from '../../src/algorithms/searching/exponential-search.js';
import { interpolationSearch } from '../../src/algorithms/searching/interpolation-search.js';
import { jumpSearch } from '../../src/algorithms/searching/jump-search.js';
import { linearSearch, linearSearchAll } from '../../src/algorithms/searching/linear-search.js';
import { median, quickSelect } from '../../src/algorithms/searching/quick-select.js';
import { findPeakIndex, ternarySearchMax, ternarySearchMin } from '../../src/algorithms/searching/ternary-search.js';
import * as sorting from '../../src/algorithms/sorting/index.js';
import { numericSort, randomInts } from '../helpers.js';

const generic = {
  bubbleSort: sorting.bubbleSort,
  cocktailShakerSort: sorting.cocktailShakerSort,
  selectionSort: sorting.selectionSort,
  insertionSort: sorting.insertionSort,
  shellSort: sorting.shellSort,
  mergeSort: sorting.mergeSort,
  bottomUpMergeSort: sorting.bottomUpMergeSort,
  quickSort: sorting.quickSort,
  quickSortFunctional: sorting.quickSortFunctional,
  heapSort: sorting.heapSort,
  timSort: sorting.timSort,
};

const numeric = {
  countingSort: sorting.countingSort,
  radixSort: sorting.radixSort,
  bucketSort: sorting.bucketSort,
};

const inputs: number[][] = [
  [],
  [1],
  [2, 1],
  [5, 5, 5, 5],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  randomInts(257, -500, 500),
  randomInts(1000, 0, 9, 11),
];

describe('Sorting', () => {
  for (const [name, sort] of Object.entries({ ...generic, ...numeric })) {
    it(`${name} sorts numbers without mutating input`, () => {
      for (const input of inputs) {
        const copy = [...input];
        assert.deepEqual(sort(input), numericSort(input));
        assert.deepEqual(input, copy);
      }
    });
  }

  for (const [name, sort] of Object.entries(generic)) {
    it(`${name} accepts a comparator`, () => {
      const words = ['pear', 'fig', 'banana', 'kiwi', 'apple'];
      assert.deepEqual(sort(words, (a, b) => a.length - b.length || a.localeCompare(b)), ['fig', 'kiwi', 'pear', 'apple', 'banana']);
    });
  }

  it('stable sorts keep equal elements in order', () => {
    const people = [
      { name: 'a', age: 30 },
      { name: 'b', age: 20 },
      { name: 'c', age: 30 },
      { name: 'd', age: 20 },
    ];
    const byAge = (x: { age: number }, y: { age: number }) => x.age - y.age;
    for (const sort of [sorting.bubbleSort, sorting.insertionSort, sorting.mergeSort, sorting.bottomUpMergeSort, sorting.timSort]) {
      assert.deepEqual(sort(people, byAge).map((p) => p.name), ['b', 'd', 'a', 'c']);
    }
  });

  it('integer-only sorts reject fractions', () => {
    assert.throws(() => sorting.countingSort([1.5]), TypeError);
    assert.throws(() => sorting.radixSort([1.5]), TypeError);
  });
});

describe('Searching', () => {
  const sorted = numericSort([...new Set(randomInts(300, -1000, 1000))]);

  it('finds every element and rejects missing ones', () => {
    for (const search of [binarySearch, binarySearchRecursive, exponentialSearch, jumpSearch, interpolationSearch, linearSearch]) {
      sorted.forEach((value, index) => assert.equal(search(sorted, value), index));
      assert.equal(search(sorted, 5000), -1);
      assert.equal(search([] as number[], 1), -1);
    }
  });

  it('computes lower and upper bounds', () => {
    const values = [1, 2, 2, 2, 5, 7];
    assert.equal(lowerBound(values, 2), 1);
    assert.equal(upperBound(values, 2), 4);
    assert.equal(lowerBound(values, 3), 4);
    assert.equal(upperBound(values, 10), 6);
    assert.equal(firstTrue(0, 100, (x) => x * x >= 50), 8);
  });

  it('linearSearchAll collects indices', () => {
    assert.deepEqual(linearSearchAll([1, 4, 5, 8, 5], (v) => v === 5), [2, 4]);
  });

  it('ternary search finds extrema', () => {
    assert.ok(Math.abs(ternarySearchMax((x) => -((x - 3) ** 2),-10, 10) - 3) < 1e-6);
    assert.ok(Math.abs(ternarySearchMin((x) => (x + 2) ** 2, -10, 10) + 2) < 1e-6);
    assert.equal(findPeakIndex([1, 3, 8, 12, 4, 2]), 3);
  });

  it('quickselect finds k-th order statistics', () => {
    const values = randomInts(101, -100, 100, 9);
    const ordered = numericSort(values);
    for (let k = 0; k < values.length; k += 10) assert.equal(quickSelect(values, k), ordered[k]);
    assert.equal(median(values), ordered[50]);
    assert.equal(median([4, 1, 3, 2]), 2.5);
    assert.throws(() => quickSelect([1], 3), RangeError);
  });
});
