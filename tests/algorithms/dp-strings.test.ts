import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { coinChangeWays, minCoins } from '../../src/algorithms/dynamic-programming/coin-change.js';
import { editDistance } from '../../src/algorithms/dynamic-programming/edit-distance.js';
import { fibonacci, fibonacciFast, fibonacciMemo, fibonacciRecursive } from '../../src/algorithms/dynamic-programming/fibonacci.js';
import { minPathSum, uniquePaths } from '../../src/algorithms/dynamic-programming/grid-paths.js';
import { knapsack01, unboundedKnapsack } from '../../src/algorithms/dynamic-programming/knapsack.js';
import { longestCommonSubsequence, longestCommonSubstring } from '../../src/algorithms/dynamic-programming/longest-common-subsequence.js';
import { longestIncreasingSubsequence } from '../../src/algorithms/dynamic-programming/longest-increasing-subsequence.js';
import { matrixChainOrder } from '../../src/algorithms/dynamic-programming/matrix-chain.js';
import { maxSubarray } from '../../src/algorithms/dynamic-programming/max-subarray.js';
import { memoize } from '../../src/algorithms/dynamic-programming/memoize.js';
import { rodCutting } from '../../src/algorithms/dynamic-programming/rod-cutting.js';
import { canPartition, subsetSum } from '../../src/algorithms/dynamic-programming/subset-sum.js';
import { wordBreak } from '../../src/algorithms/dynamic-programming/word-break.js';
import { AhoCorasick } from '../../src/algorithms/strings/aho-corasick.js';
import { boyerMooreHorspool } from '../../src/algorithms/strings/boyer-moore-horspool.js';
import { kmpSearch, prefixFunction } from '../../src/algorithms/strings/kmp.js';
import { longestPalindromicSubstring } from '../../src/algorithms/strings/manacher.js';
import { rabinKarp } from '../../src/algorithms/strings/rabin-karp.js';
import {
  groupAnagrams,
  isAnagram,
  isBalanced,
  isPalindrome,
  reverseWords,
  runLengthDecode,
  runLengthEncode,
} from '../../src/algorithms/strings/string-utils.js';
import { countDistinctSubstrings, lcpArray, suffixArray } from '../../src/algorithms/strings/suffix-array.js';
import { zFunction, zSearch } from '../../src/algorithms/strings/z-function.js';

describe('Dynamic programming', () => {
  it('fibonacci variants agree', () => {
    assert.equal(fibonacciRecursive(20), 6765);
    assert.equal(fibonacciMemo(50), 12586269025);
    assert.equal(fibonacci(0), 0n);
    assert.equal(fibonacci(100), 354224848179261915075n);
    for (let n = 0; n < 60; n++) assert.equal(fibonacciFast(n), fibonacci(n));
  });

  it('memoize caches results', () => {
    let calls = 0;
    const square = memoize((n: number) => {
      calls++;
      return n * n;
    });
    square(4);
    square(4);
    assert.equal(calls, 1);
    assert.equal(square.cache.get(4), 16);
    const add = memoize((a: number, b: number) => a + b);
    assert.equal(add(1, 2), 3);
    assert.equal(add.cache.has('[1,2]'), true);
  });

  it('knapsack', () => {
    const items = [
      { weight: 1, value: 1 },
      { weight: 3, value: 4 },
      { weight: 4, value: 5 },
      { weight: 5, value: 7 },
    ];
    assert.deepEqual(knapsack01(items, 7), { value: 9, items: [1, 2] });
    assert.equal(unboundedKnapsack(items, 7), 9);
  });

  it('coin change', () => {
    assert.deepEqual(minCoins([1, 3, 4], 6), { count: 2, coins: [3, 3] });
    assert.equal(minCoins([2], 3), null);
    assert.equal(coinChangeWays([1, 2, 5], 5), 4);
  });

  it('sequence problems', () => {
    assert.equal(longestCommonSubsequence('ABCBDAB', 'BDCABA').length, 4);
    assert.equal(longestCommonSubsequence('AGGTAB', 'GXTXAYB'), 'GTAB');
    assert.equal(longestCommonSubstring('xabcdey', 'zzbcdq'), 'bcd');
    assert.deepEqual(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18]), [2, 3, 7, 18]);
    assert.deepEqual(longestIncreasingSubsequence([]), []);
    assert.equal(editDistance('kitten', 'sitting'), 3);
    assert.equal(editDistance('', 'abc'), 3);
    assert.deepEqual(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), { sum: 6, start: 3, end: 6 });
    assert.deepEqual(maxSubarray([-3, -1, -2]), { sum: -1, start: 1, end: 1 });
  });

  it('optimization problems', () => {
    assert.deepEqual(matrixChainOrder([10, 30, 5, 60]), { cost: 4500, order: '((A1A2)A3)' });
    assert.deepEqual(rodCutting([1, 5, 8, 9, 10, 17, 17, 20], 8), { revenue: 22, pieces: [2, 6] });
    assert.deepEqual(subsetSum([3, 34, 4, 12, 5, 2], 9), [4, 5]);
    assert.equal(subsetSum([1, 2], 10), null);
    assert.equal(canPartition([1, 5, 11, 5]), true);
    assert.equal(canPartition([1, 2, 3, 5]), false);
    assert.deepEqual(wordBreak('applepenapple', ['apple', 'pen']), ['apple', 'pen', 'apple']);
    assert.equal(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), null);
    assert.equal(uniquePaths(3, 7), 28);
    assert.equal(uniquePaths(3, 3, [[], [false, true]]), 2);
    assert.equal(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]), 7);
  });
});

describe('String algorithms', () => {
  const text = 'abracadabra abracadabra';

  it('pattern search algorithms agree', () => {
    const expected = [0, 7, 12, 19];
    for (const search of [kmpSearch, rabinKarp, zSearch, boyerMooreHorspool]) {
      assert.deepEqual(search(text, 'abra'), expected);
      assert.deepEqual(search('aaaa', 'aa'), [0, 1, 2]);
      assert.deepEqual(search('abc', 'abcd'), []);
      assert.deepEqual(search('abc', ''), []);
    }
  });

  it('prefix and z functions', () => {
    assert.deepEqual(prefixFunction('aabaaab'), [0, 1, 0, 1, 2, 2, 3]);
    assert.deepEqual(zFunction('aaabaab'), [7, 2, 1, 0, 2, 1, 0]);
  });

  it('aho-corasick finds many patterns', () => {
    const matches = new AhoCorasick(['he', 'she', 'his', 'hers']).search('ahishers');
    assert.deepEqual(
      matches.map((m) => `${m.pattern}@${m.index}`).sort(),
      ['he@4', 'hers@4', 'his@1', 'she@3'],
    );
  });

  it('palindromes', () => {
    assert.equal(longestPalindromicSubstring('babad').length, 3);
    assert.equal(longestPalindromicSubstring('forgeeksskeegfor'), 'geeksskeeg');
    assert.equal(longestPalindromicSubstring('a'), 'a');
    assert.equal(isPalindrome('A man, a plan, a canal: Panama'), true);
    assert.equal(isPalindrome('hello'), false);
  });

  it('suffix array and lcp', () => {
    const sa = suffixArray('banana');
    assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
    assert.deepEqual(lcpArray('banana', sa), [1, 3, 0, 0, 2]);
    assert.equal(countDistinctSubstrings('abab'), 7);
    assert.deepEqual(suffixArray(''), []);
  });

  it('utility functions', () => {
    assert.equal(isBalanced('(hello)[world]{!}'), true);
    assert.equal(isBalanced('(hello)[world'), false);
    assert.equal(isBalanced('([)]'), false);
    assert.equal(isAnagram('listen', 'silent'), true);
    assert.equal(isAnagram('rat', 'car'), false);
    assert.deepEqual(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']), [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]);
    assert.equal(runLengthEncode('aaabccdddd'), '3a1b2c4d');
    assert.equal(runLengthDecode('3a1b2c4d'), 'aaabccdddd');
    assert.equal(reverseWords('  the sky  is blue '), 'blue is sky the');
  });
});
