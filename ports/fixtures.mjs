import { writeFile } from 'node:fs/promises';

const cases = [
  ['sorting/bubble-sort', 'bubbleSort', [[3, -1, 3, 0]]],
  ['sorting/cocktail-shaker-sort', 'cocktailShakerSort', [[3, -1, 3, 0]]],
  ['sorting/selection-sort', 'selectionSort', [[3, -1, 3, 0]]],
  ['sorting/insertion-sort', 'insertionSort', [[3, -1, 3, 0]]],
  ['sorting/shell-sort', 'shellSort', [[3, -1, 3, 0]]],
  ['sorting/merge-sort', 'mergeSort', [[3, -1, 3, 0]]],
  ['sorting/merge-sort', 'bottomUpMergeSort', [[3, -1, 3, 0]]],
  ['sorting/quick-sort', 'quickSort', [[3, -1, 3, 0]]],
  ['sorting/quick-sort', 'quickSortFunctional', [[3, -1, 3, 0]]],
  ['sorting/heap-sort', 'heapSort', [[3, -1, 3, 0]]],
  ['sorting/counting-sort', 'countingSort', [[3, -1, 3, 0]]],
  ['sorting/radix-sort', 'radixSort', [[3, -1, 3, 0]]],
  ['sorting/bucket-sort', 'bucketSort', [[3, -1, 3, 0]]],
  ['sorting/tim-sort', 'timSort', [[3, -1, 3, 0]]],
  ['searching/linear-search', 'linearSearch', [[4, 1, 4], 4]],
  ['searching/binary-search', 'binarySearch', [[1, 3, 5, 7], 5]],
  ['searching/jump-search', 'jumpSearch', [[1, 3, 5, 7], 5]],
  ['searching/interpolation-search', 'interpolationSearch', [[1, 3, 5, 7], 5]],
  ['searching/exponential-search', 'exponentialSearch', [[1, 3, 5, 7], 5]],
  ['searching/quick-select', 'quickSelect', [[7, 10, 4, 3, 20, 15], 2]],
  ['searching/quick-select', 'median', [[1, 5, 3, 7]]],
  ['dynamic-programming/fibonacci', 'fibonacciRecursive', [10]],
  ['dynamic-programming/fibonacci', 'fibonacci', [100]],
  ['dynamic-programming/fibonacci', 'fibonacciFast', [100]],
  ['dynamic-programming/edit-distance', 'editDistance', ['kitten', 'sitting']],
  ['dynamic-programming/coin-change', 'coinChangeWays', [[1, 2, 5], 5]],
  ['dynamic-programming/grid-paths', 'uniquePaths', [3, 7]],
  ['dynamic-programming/grid-paths', 'minPathSum', [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]]],
  ['dynamic-programming/subset-sum', 'canPartition', [[1, 5, 11, 5]]],
  ['strings/kmp', 'prefixFunction', ['ababaca']],
  ['strings/kmp', 'kmpSearch', ['aaaaa', 'aa']],
  ['strings/z-function', 'zFunction', ['aaaaa']],
  ['strings/rabin-karp', 'rabinKarp', ['aaaaa', 'aa']],
  ['strings/boyer-moore-horspool', 'boyerMooreHorspool', ['aaaaa', 'aa']],
  ['strings/manacher', 'longestPalindromicSubstring', ['forgeeksskeegfor']],
  ['strings/suffix-array', 'suffixArray', ['banana']],
  ['math/gcd', 'gcd', [-48, 18]],
  ['math/gcd', 'lcm', [21, 6]],
  ['math/gcd', 'extendedGcd', [240, 46]],
  ['math/gcd', 'modInverse', [3, 11]],
  ['math/power', 'fastPower', [2, 10]],
  ['math/power', 'integerSqrt', [80]],
  ['math/primes', 'sieveOfEratosthenes', [30]],
  ['math/primes', 'linearSieve', [10]],
  ['math/primes', 'isPrime', [97]],
  ['math/primes', 'primeFactors', [360]],
  ['math/primes', 'divisors', [36]],
  ['math/primes', 'eulerPhi', [36]],
  ['math/combinatorics', 'factorial', [30]],
  ['math/combinatorics', 'binomial', [50, 25]],
  ['math/combinatorics', 'catalan', [20]],
  ['math/number-conversion', 'toRoman', [2026]],
  ['math/number-conversion', 'fromRoman', ['MMXXVI']],
  ['math/matrix', 'multiply', [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]],
  ['math/matrix', 'determinant', [[[1, 2], [3, 4]]]],
  ['backtracking/n-queens', 'countNQueens', [4]],
  ['backtracking/word-search', 'wordSearch', [['ABCE', 'SFCS', 'ADEE'], 'ABCCED']],
  ['greedy/jump-game', 'canReachEnd', [[3, 2, 1, 0, 4]]],
  ['greedy/jump-game', 'minJumps', [[2, 3, 1, 1, 4]]],
  ['bit-manipulation/bits', 'reverseBits', [1]],
  ['bit-manipulation/bits', 'countSetBits', [4294967295]],
  ['graphs/topological-sort', 'topologicalSortKahn', [[[1, 2], [3], [3], []]]],
  ['graphs/bipartite', 'isBipartite', [[[1, 2], [0, 2], [0, 1]]]],
  ['graphs/max-flow', 'edmondsKarp', [[[0, 3, 2, 0], [0, 0, 1, 2], [0, 0, 0, 3], [0, 0, 0, 0]], 0, 3]],
];

const normalize = value => JSON.parse(JSON.stringify(value, (_, item) =>
  typeof item === 'bigint' ? item.toString() : item instanceof Map ? [...item] : item));
const output = [];
for (const [module, name, args] of cases) {
  const library = await import(`./javascript/algorithms/${module}.js`);
  if (typeof library[name] !== 'function') throw new Error(`Missing ${module}:${name}`);
  output.push({ source: `src/algorithms/${module}.ts`, name, args, expected: normalize(library[name](...structuredClone(args))) });
}
await writeFile(new URL('./golden-cases.json', import.meta.url), JSON.stringify(output, null, 2) + '\n');
console.log(`${output.length} reference cases`);
