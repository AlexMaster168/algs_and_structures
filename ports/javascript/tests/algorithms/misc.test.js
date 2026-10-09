import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { combinations, combinationSum, permutations, subsets } from '../../algorithms/backtracking/permutations.js';
import { countNQueens, nQueens } from '../../algorithms/backtracking/n-queens.js';
import { solveSudoku } from '../../algorithms/backtracking/sudoku.js';
import { wordSearch } from '../../algorithms/backtracking/word-search.js';
import * as bits from '../../algorithms/bit-manipulation/bits.js';
import { closestPair, convexHull, pointInPolygon, polygonArea, segmentsIntersect, } from '../../algorithms/geometry/geometry.js';
import { activitySelection, mergeIntervals, minMeetingRooms } from '../../algorithms/greedy/activity-selection.js';
import { fractionalKnapsack } from '../../algorithms/greedy/fractional-knapsack.js';
import { huffmanCodes, huffmanDecode, huffmanEncode } from '../../algorithms/greedy/huffman.js';
import { canReachEnd, greedyChange, minJumps } from '../../algorithms/greedy/jump-game.js';
import { binomial, catalan, factorial, nextPermutation, pascalTriangle } from '../../algorithms/math/combinatorics.js';
import { extendedGcd, gcd, lcm, modInverse } from '../../algorithms/math/gcd.js';
import { determinant, identity, matrixPower, multiply, solveLinearSystem, transpose } from '../../algorithms/math/matrix.js';
import { fromBase, fromRoman, toBase, toRoman } from '../../algorithms/math/number-conversion.js';
import { fastPower, integerSqrt, modPow, newtonSqrt } from '../../algorithms/math/power.js';
import { divisors, eulerPhi, isPrime, linearSieve, millerRabin, primeFactors, sieveOfEratosthenes } from '../../algorithms/math/primes.js';
import { fisherYatesShuffle, monteCarloPi, mulberry32, reservoirSample } from '../../algorithms/randomized/shuffle.js';
import { PrefixSums, PrefixSums2D, differenceArrayApply, majorityElement, subarraySumEquals } from '../../algorithms/techniques/prefix-sums.js';
import { longestUniqueSubstring, maxSumWindow, minWindowSubstring, slidingWindowMaximum } from '../../algorithms/techniques/sliding-window.js';
import { containerWithMostWater, dutchNationalFlag, hasCycleFloyd, removeDuplicatesSorted, threeSum, twoSum, twoSumSorted, } from '../../algorithms/techniques/two-pointers.js';
import { numericSort } from '../helpers.js';
describe('Math', () => {
    it('gcd family', () => {
        assert.equal(gcd(48, 18), 6);
        assert.equal(gcd(-48, 18), 6);
        assert.equal(lcm(4, 6), 12);
        const { gcd: g, x, y } = extendedGcd(240, 46);
        assert.equal(g, 2);
        assert.equal(240 * x + 46 * y, 2);
        assert.equal(modInverse(3, 11), 4);
        assert.equal(modInverse(2, 4), null);
    });
    it('powers and roots', () => {
        assert.equal(fastPower(2, 10), 1024);
        assert.equal(fastPower(2, -2), 0.25);
        assert.equal(modPow(2n, 100n, 1000000007n), 976371285n);
        assert.equal(integerSqrt(99), 9);
        assert.equal(integerSqrt(100), 10);
        assert.ok(Math.abs(newtonSqrt(2) - Math.SQRT2) < 1e-10);
    });
    it('primes', () => {
        assert.deepEqual(sieveOfEratosthenes(20), [2, 3, 5, 7, 11, 13, 17, 19]);
        const { primes, smallestFactor } = linearSieve(100);
        assert.deepEqual(primes, sieveOfEratosthenes(100));
        assert.equal(smallestFactor[91], 7);
        for (let n = 0; n < 500; n++) {
            assert.equal(isPrime(n), primes.includes(n) || (n > 100 && millerRabin(BigInt(n))));
            assert.equal(millerRabin(BigInt(n)), isPrime(n));
        }
        assert.equal(millerRabin(2n ** 61n - 1n), true);
        assert.equal(millerRabin(3215031751n), false);
        assert.deepEqual([...primeFactors(360)], [[2, 3], [3, 2], [5, 1]]);
        assert.deepEqual(divisors(28), [1, 2, 4, 7, 14, 28]);
        assert.equal(eulerPhi(36), 12);
    });
    it('matrices', () => {
        assert.deepEqual(multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[19, 22], [43, 50]]);
        assert.throws(() => multiply([[1, 2]], [[1, 2]]), RangeError);
        assert.deepEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
        assert.deepEqual(matrixPower([[1, 1], [1, 0]], 10), [[89, 55], [55, 34]]);
        assert.deepEqual(matrixPower([[2]], 0), identity(1));
        assert.ok(Math.abs(determinant([[2, -3, 1], [2, 0, -1], [1, 4, 5]]) - 49) < 1e-9);
        const solution = solveLinearSystem([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], [8, -11, -3]);
        [2, 3, -1].forEach((v, i) => assert.ok(Math.abs(solution[i] - v) < 1e-9));
        assert.equal(solveLinearSystem([[1, 2], [2, 4]], [1, 2]), null);
    });
    it('combinatorics', () => {
        assert.equal(factorial(20), 2432902008176640000n);
        assert.equal(binomial(52, 5), 2598960n);
        assert.equal(binomial(5, 7), 0n);
        assert.deepEqual(pascalTriangle(5).at(-1), [1, 4, 6, 4, 1]);
        assert.deepEqual([0, 1, 2, 3, 4, 5].map((n) => catalan(n)), [1n, 1n, 2n, 5n, 14n, 42n]);
        const values = [1, 2, 3];
        const seen = [[...values]];
        while (nextPermutation(values))
            seen.push([...values]);
        assert.equal(seen.length, 6);
        assert.deepEqual(values, [1, 2, 3]);
    });
    it('number conversions', () => {
        assert.equal(toBase(255, 16), 'ff');
        assert.equal(toBase(-10, 2), '-1010');
        assert.equal(fromBase('ff', 16), 255);
        assert.equal(fromBase('-1010', 2), -10);
        assert.throws(() => fromBase('2', 2), RangeError);
        assert.equal(toRoman(1994), 'MCMXCIV');
        for (let n = 1; n < 4000; n += 37)
            assert.equal(fromRoman(toRoman(n)), n);
    });
});
describe('Backtracking', () => {
    it('generates permutations, combinations and subsets', () => {
        assert.equal(permutations([1, 2, 3, 4]).length, 24);
        assert.deepEqual(permutations(['a', 'b']), [['a', 'b'], ['b', 'a']]);
        assert.deepEqual(combinations([1, 2, 3, 4], 2), [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
        assert.equal(subsets([1, 2, 3]).length, 8);
        assert.deepEqual(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
    });
    it('solves n-queens', () => {
        assert.deepEqual(nQueens(4), [
            ['.Q..', '...Q', 'Q...', '..Q.'],
            ['..Q.', 'Q...', '...Q', '.Q..'],
        ]);
        assert.equal(nQueens(8).length, 92);
        assert.equal(countNQueens(8), 92);
        assert.equal(countNQueens(10), 724);
    });
    it('solves sudoku', () => {
        const puzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9],
        ];
        const solved = solveSudoku(puzzle);
        assert.deepEqual(solved[0], [5, 3, 4, 6, 7, 8, 9, 1, 2]);
        for (let i = 0; i < 9; i++) {
            assert.deepEqual(numericSort(solved[i]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            assert.deepEqual(numericSort(solved.map((row) => row[i])), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
        assert.equal(puzzle[0][2], 0);
        const invalid = puzzle.map((row) => [...row]);
        invalid[0][1] = 5;
        assert.equal(solveSudoku(invalid), null);
    });
    it('word search', () => {
        const grid = ['ABCE', 'SFCS', 'ADEE'];
        assert.equal(wordSearch(grid, 'ABCCED'), true);
        assert.equal(wordSearch(grid, 'SEE'), true);
        assert.equal(wordSearch(grid, 'ABCB'), false);
    });
});
describe('Greedy', () => {
    it('interval problems', () => {
        const intervals = [
            { start: 1, end: 4 },
            { start: 3, end: 5 },
            { start: 0, end: 6 },
            { start: 5, end: 7 },
            { start: 8, end: 9 },
            { start: 5, end: 9 },
        ];
        assert.deepEqual(activitySelection(intervals), [{ start: 1, end: 4 }, { start: 5, end: 7 }, { start: 8, end: 9 }]);
        assert.deepEqual(mergeIntervals([{ start: 1, end: 3 }, { start: 8, end: 10 }, { start: 2, end: 6 }]), [
            { start: 1, end: 6 },
            { start: 8, end: 10 },
        ]);
        assert.equal(minMeetingRooms([{ start: 0, end: 30 }, { start: 5, end: 10 }, { start: 15, end: 20 }]), 2);
    });
    it('fractional knapsack', () => {
        const items = [
            { weight: 10, value: 60 },
            { weight: 20, value: 100 },
            { weight: 30, value: 120 },
        ];
        assert.equal(fractionalKnapsack(items, 50), 240);
    });
    it('huffman coding round-trips', () => {
        const text = 'abracadabra';
        const { encoded, codes } = huffmanEncode(text);
        assert.equal(huffmanDecode(encoded, codes), text);
        assert.equal(encoded.length, 23);
        assert.equal(codes.get('a').length, 1);
        assert.deepEqual([...huffmanCodes('zzz')], [['z', '0']]);
    });
    it('jumps and change', () => {
        assert.equal(canReachEnd([2, 3, 1, 1, 4]), true);
        assert.equal(canReachEnd([3, 2, 1, 0, 4]), false);
        assert.equal(minJumps([2, 3, 1, 1, 4]), 2);
        assert.equal(minJumps([1, 0, 1]), -1);
        assert.deepEqual(greedyChange(289, [1, 5, 10, 25, 100]), [100, 100, 25, 25, 25, 10, 1, 1, 1, 1]);
    });
});
describe('Techniques', () => {
    it('two pointers', () => {
        assert.deepEqual(twoSumSorted([1, 2, 4, 7, 11], 15), [2, 4]);
        assert.equal(twoSumSorted([1, 2], 10), null);
        assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
        assert.deepEqual(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
        assert.equal(containerWithMostWater([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
        const sorted = [1, 1, 2, 3, 3, 3, 4];
        assert.equal(removeDuplicatesSorted(sorted), 4);
        assert.deepEqual(sorted, [1, 2, 3, 4]);
        assert.deepEqual(dutchNationalFlag([2, 0, 2, 1, 1, 0], 1), [0, 0, 1, 1, 2, 2]);
        const next = (n) => [1, 2, 3, 1][n] ?? null;
        assert.equal(hasCycleFloyd(0, next), true);
        assert.equal(hasCycleFloyd(0, (n) => (n < 5 ? n + 1 : null)), false);
    });
    it('sliding window', () => {
        assert.equal(maxSumWindow([1, 4, 2, 10, 23, 3, 1, 0, 20], 4), 39);
        assert.deepEqual(slidingWindowMaximum([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
        assert.equal(longestUniqueSubstring('abcabcbb'), 'abc');
        assert.equal(minWindowSubstring('ADOBECODEBANC', 'ABC'), 'BANC');
        assert.equal(minWindowSubstring('a', 'aa'), '');
    });
    it('prefix sums', () => {
        const sums = new PrefixSums([3, 1, 4, 1, 5, 9]);
        assert.equal(sums.sum(1, 3), 6);
        const grid = new PrefixSums2D([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        assert.equal(grid.sum(1, 1, 2, 2), 28);
        assert.equal(subarraySumEquals([1, 1, 1], 2), 2);
        assert.deepEqual(differenceArrayApply(5, [[1, 3, 2], [2, 4, 3]]), [0, 2, 5, 5, 3]);
        assert.equal(majorityElement([2, 2, 1, 1, 1, 2, 2]), 2);
        assert.equal(majorityElement([1, 2, 3]), null);
    });
});
describe('Randomized', () => {
    it('seeded generator is deterministic', () => {
        const a = mulberry32(1);
        const b = mulberry32(1);
        for (let i = 0; i < 5; i++)
            assert.equal(a(), b());
    });
    it('shuffle keeps elements', () => {
        const values = Array.from({ length: 50 }, (_, i) => i);
        const shuffled = fisherYatesShuffle(values, mulberry32(3));
        assert.notDeepEqual(shuffled, values);
        assert.deepEqual(numericSort(shuffled), values);
    });
    it('reservoir sampling and monte carlo', () => {
        const sample = reservoirSample(Array.from({ length: 1000 }, (_, i) => i), 10, mulberry32(5));
        assert.equal(sample.length, 10);
        assert.equal(new Set(sample).size, 10);
        assert.ok(Math.abs(monteCarloPi(100000, mulberry32(7)) - Math.PI) < 0.05);
    });
});
describe('Bit manipulation', () => {
    it('bit helpers', () => {
        assert.equal(bits.getBit(0b1010, 1), 1);
        assert.equal(bits.setBit(0b1010, 0), 0b1011);
        assert.equal(bits.clearBit(0b1010, 3), 0b0010);
        assert.equal(bits.toggleBit(0b1010, 2), 0b1110);
        assert.equal(bits.countSetBits(0xffffffff), 32);
        assert.equal(bits.isPowerOfTwo(64), true);
        assert.equal(bits.isPowerOfTwo(0), false);
        assert.equal(bits.lowestSetBit(12), 4);
        assert.equal(bits.singleNumber([4, 1, 2, 1, 2]), 4);
        assert.equal(bits.reverseBits(1), 0x80000000);
        assert.deepEqual(bits.grayCode(3), [0, 1, 3, 2, 6, 7, 5, 4]);
        assert.equal(bits.subsetsByMask(['a', 'b', 'c']).length, 8);
        assert.deepEqual(bits.swapWithoutTemp(3, 9), [9, 3]);
        assert.equal(bits.hammingDistance(1, 4), 2);
    });
});
describe('Geometry', () => {
    it('convex hull and area', () => {
        const points = [
            { x: 0, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 0, y: 2 },
            { x: 1, y: 3 },
        ];
        const hull = convexHull(points);
        assert.equal(hull.length, 5);
        assert.equal(polygonArea(hull), 5);
        assert.equal(pointInPolygon({ x: 1, y: 1 }, hull), true);
        assert.equal(pointInPolygon({ x: 3, y: 1 }, hull), false);
    });
    it('segment intersection', () => {
        assert.equal(segmentsIntersect({ x: 0, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }, { x: 4, y: 0 }), true);
        assert.equal(segmentsIntersect({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }), false);
        assert.equal(segmentsIntersect({ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 1, y: 1 }, { x: 3, y: 3 }), true);
    });
    it('closest pair matches brute force', () => {
        const random = mulberry32(11);
        const points = Array.from({ length: 300 }, () => ({ x: random() * 1000, y: random() * 1000 }));
        let best = Infinity;
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++)
                best = Math.min(best, Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y));
        }
        assert.equal(closestPair(points).distance, best);
        assert.equal(closestPair([{ x: 0, y: 0 }]), null);
    });
});
