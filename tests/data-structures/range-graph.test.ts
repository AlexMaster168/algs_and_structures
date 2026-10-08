import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DisjointSet } from '../../src/data-structures/graphs/disjoint-set.js';
import { Graph } from '../../src/data-structures/graphs/graph.js';
import { FenwickTree } from '../../src/data-structures/range-queries/fenwick-tree.js';
import { LazySegmentTree } from '../../src/data-structures/range-queries/lazy-segment-tree.js';
import { minSegmentTree, SegmentTree, sumSegmentTree } from '../../src/data-structures/range-queries/segment-tree.js';
import { maxSparseTable, minSparseTable } from '../../src/data-structures/range-queries/sparse-table.js';
import { SqrtDecomposition } from '../../src/data-structures/range-queries/sqrt-decomposition.js';
import { randomInts } from '../helpers.js';

const naiveSum = (values: number[], l: number, r: number): number => values.slice(l, r + 1).reduce((a, b) => a + b, 0);

describe('Range query structures', () => {
  const values = randomInts(57, -50, 50);
  const ranges = randomInts(400, 0, 56, 3).map((a, i, all) => {
    const b = all[(i + 1) % all.length]!;
    return [Math.min(a, b), Math.max(a, b)] as const;
  });

  it('segment tree answers sums and minimums with updates', () => {
    const data = [...values];
    const sums = sumSegmentTree(data);
    const mins = minSegmentTree(data);
    ranges.forEach(([l, r], i) => {
      if (i % 4 === 0) {
        data[l] = i;
        sums.update(l, i);
        mins.update(l, i);
      }
      assert.equal(sums.query(l, r), naiveSum(data, l, r));
      assert.equal(mins.query(l, r), Math.min(...data.slice(l, r + 1)));
    });
  });

  it('segment tree preserves order for non-commutative operations', () => {
    const letters = 'abcdefghijk'.split('');
    const tree = new SegmentTree(letters, (a, b) => a + b, '');
    assert.equal(tree.query(2, 7), 'cdefgh');
    tree.update(3, 'X');
    assert.equal(tree.query(0, 10), 'abcXefghijk');
  });

  it('lazy segment tree handles range updates', () => {
    const data = [...values];
    const tree = new LazySegmentTree(data);
    ranges.forEach(([l, r], i) => {
      if (i % 3 === 0) {
        tree.rangeAdd(l, r, i);
        for (let k = l; k <= r; k++) data[k]! += i;
      }
      assert.equal(tree.rangeSum(l, r), naiveSum(data, l, r));
    });
  });

  it('fenwick tree and sqrt decomposition answer range sums', () => {
    const data = [...values];
    const fenwick = new FenwickTree(data);
    const sqrt = new SqrtDecomposition(data);
    ranges.forEach(([l, r], i) => {
      if (i % 5 === 0) {
        data[r] = -i;
        fenwick.set(r, -i);
        sqrt.update(r, -i);
      }
      assert.equal(fenwick.rangeSum(l, r), naiveSum(data, l, r));
      assert.equal(sqrt.rangeSum(l, r), naiveSum(data, l, r));
    });

    const empty = new FenwickTree(5);
    empty.add(2, 10);
    assert.equal(empty.prefixSum(4), 10);
  });

  it('sparse table answers min and max', () => {
    const mins = minSparseTable(values);
    const maxs = maxSparseTable(values);
    for (const [l, r] of ranges) {
      assert.equal(mins.query(l, r), Math.min(...values.slice(l, r + 1)));
      assert.equal(maxs.query(l, r), Math.max(...values.slice(l, r + 1)));
    }
  });
});

describe('Graph', () => {
  it('supports undirected graphs', () => {
    const graph = new Graph<string>().addEdge('a', 'b', 3).addEdge('b', 'c').addVertex('d');
    assert.deepEqual(graph.neighbors('b').sort(), ['a', 'c']);
    assert.equal(graph.weight('b', 'a'), 3);
    assert.equal(graph.edgeCount, 2);
    assert.equal(graph.degree('d'), 0);

    const { vertices, matrix } = graph.toAdjacencyMatrix();
    assert.deepEqual(vertices, ['a', 'b', 'c', 'd']);
    assert.deepEqual(matrix, [
      [0, 3, 0, 0],
      [3, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ]);

    assert.equal(graph.removeVertex('b'), true);
    assert.equal(graph.edgeCount, 0);
  });

  it('supports directed graphs', () => {
    const graph = new Graph<number>(true).addEdge(1, 2).addEdge(2, 3);
    assert.equal(graph.hasEdge(1, 2), true);
    assert.equal(graph.hasEdge(2, 1), false);
    assert.deepEqual(graph.toAdjacencyList().list, [[1], [2], []]);
    assert.equal(graph.removeEdge(1, 2), true);
    assert.equal(graph.edgeCount, 1);
  });
});

describe('DisjointSet', () => {
  it('unions and finds', () => {
    const sets = new DisjointSet(6);
    assert.equal(sets.union(0, 1), true);
    assert.equal(sets.union(1, 2), true);
    assert.equal(sets.union(0, 2), false);
    sets.union(3, 4);
    assert.equal(sets.connected(0, 2), true);
    assert.equal(sets.connected(0, 3), false);
    assert.equal(sets.count, 3);
    assert.equal(sets.sizeOf(2), 3);
  });
});
