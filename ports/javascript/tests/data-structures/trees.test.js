import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AVLTree } from '../../data-structures/trees/avl-tree.js';
import { BTree } from '../../data-structures/trees/b-tree.js';
import { BinarySearchTree } from '../../data-structures/trees/binary-search-tree.js';
import { RedBlackTree } from '../../data-structures/trees/red-black-tree.js';
import { Trie } from '../../data-structures/trees/trie.js';
import { numericSort, randomInts } from '../helpers.js';
const checkAgainstSet = (tree, afterEach) => {
    const reference = new Set();
    const inserts = randomInts(1500, 0, 600, 1);
    const deletes = randomInts(1500, 0, 600, 2);
    inserts.forEach((value, i) => {
        assert.equal(tree.insert(value), !reference.has(value));
        reference.add(value);
        const removed = deletes[i];
        if (i % 2 === 0)
            assert.equal(tree.delete(removed), reference.delete(removed));
        if (i % 100 === 0)
            afterEach?.();
    });
    assert.deepEqual([...tree], numericSort([...reference]));
    assert.equal(tree.size, reference.size);
    for (let v = 0; v <= 600; v += 7)
        assert.equal(tree.has(v), reference.has(v));
    afterEach?.();
    for (const value of [...reference])
        assert.equal(tree.delete(value), true);
    assert.equal(tree.size, 0);
    assert.deepEqual([...tree], []);
};
describe('BinarySearchTree', () => {
    it('behaves like a sorted set', () => checkAgainstSet(new BinarySearchTree()));
    it('answers min, max, floor and ceil', () => {
        const tree = BinarySearchTree.from([50, 30, 70, 20, 40, 60, 80]);
        assert.equal(tree.min(), 20);
        assert.equal(tree.max(), 80);
        assert.equal(tree.floor(65), 60);
        assert.equal(tree.ceil(65), 70);
        assert.equal(tree.floor(10), undefined);
        assert.equal(tree.height(), 3);
        assert.equal(tree.rootNode?.value, 50);
    });
});
describe('AVLTree', () => {
    it('stays balanced', () => {
        const tree = new AVLTree();
        checkAgainstSet(tree, () => assert.ok(tree.isBalanced()));
    });
    it('has logarithmic height on sorted input', () => {
        const tree = new AVLTree();
        for (let i = 0; i < 1023; i++)
            tree.insert(i);
        assert.equal(tree.height(), 10);
    });
});
describe('RedBlackTree', () => {
    it('keeps red-black invariants', () => {
        const tree = new RedBlackTree();
        checkAgainstSet(tree, () => assert.ok(tree.isValid()));
    });
    it('has logarithmic height on sorted input', () => {
        const tree = new RedBlackTree();
        for (let i = 0; i < 1000; i++)
            tree.insert(i);
        assert.ok(tree.height() <= 2 * Math.log2(1001));
    });
});
describe('BTree', () => {
    for (const degree of [2, 3, 5]) {
        it(`behaves like a sorted set with t=${degree}`, () => checkAgainstSet(new BTree(degree)));
    }
    it('is shallow', () => {
        const tree = new BTree(16);
        for (let i = 0; i < 10000; i++)
            tree.insert(i);
        assert.ok(tree.height() <= 4);
    });
});
describe('Trie', () => {
    it('stores words and prefixes', () => {
        const trie = Trie.from(['car', 'card', 'care', 'cat', 'dog']);
        assert.equal(trie.has('car'), true);
        assert.equal(trie.has('ca'), false);
        assert.equal(trie.startsWith('ca'), true);
        assert.equal(trie.countWithPrefix('car'), 3);
        assert.deepEqual(trie.wordsWithPrefix('car'), ['car', 'card', 'care']);
        assert.equal(trie.delete('car'), true);
        assert.equal(trie.has('car'), false);
        assert.equal(trie.has('card'), true);
        assert.equal(trie.delete('dog'), true);
        assert.equal(trie.startsWith('d'), false);
        assert.equal(trie.size, 3);
        assert.equal(trie.countWithPrefix(''), 3);
    });
});
