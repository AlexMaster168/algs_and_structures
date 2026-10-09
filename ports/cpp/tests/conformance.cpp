#include "../shared/json.hpp"
#include <iostream>
#include "../algorithms/backtracking/n-queens.hpp"
#include "../algorithms/backtracking/word-search.hpp"
#include "../algorithms/bit-manipulation/bits.hpp"
#include "../algorithms/dynamic-programming/coin-change.hpp"
#include "../algorithms/dynamic-programming/edit-distance.hpp"
#include "../algorithms/dynamic-programming/fibonacci.hpp"
#include "../algorithms/dynamic-programming/grid-paths.hpp"
#include "../algorithms/dynamic-programming/subset-sum.hpp"
#include "../algorithms/graphs/bipartite.hpp"
#include "../algorithms/graphs/max-flow.hpp"
#include "../algorithms/graphs/topological-sort.hpp"
#include "../algorithms/greedy/jump-game.hpp"
#include "../algorithms/math/combinatorics.hpp"
#include "../algorithms/math/gcd.hpp"
#include "../algorithms/math/matrix.hpp"
#include "../algorithms/math/number-conversion.hpp"
#include "../algorithms/math/power.hpp"
#include "../algorithms/math/primes.hpp"
#include "../algorithms/searching/binary-search.hpp"
#include "../algorithms/searching/exponential-search.hpp"
#include "../algorithms/searching/interpolation-search.hpp"
#include "../algorithms/searching/jump-search.hpp"
#include "../algorithms/searching/linear-search.hpp"
#include "../algorithms/searching/quick-select.hpp"
#include "../algorithms/sorting/bubble-sort.hpp"
#include "../algorithms/sorting/bucket-sort.hpp"
#include "../algorithms/sorting/cocktail-shaker-sort.hpp"
#include "../algorithms/sorting/counting-sort.hpp"
#include "../algorithms/sorting/heap-sort.hpp"
#include "../algorithms/sorting/insertion-sort.hpp"
#include "../algorithms/sorting/merge-sort.hpp"
#include "../algorithms/sorting/quick-sort.hpp"
#include "../algorithms/sorting/radix-sort.hpp"
#include "../algorithms/sorting/selection-sort.hpp"
#include "../algorithms/sorting/shell-sort.hpp"
#include "../algorithms/sorting/tim-sort.hpp"
#include "../algorithms/strings/boyer-moore-horspool.hpp"
#include "../algorithms/strings/kmp.hpp"
#include "../algorithms/strings/manacher.hpp"
#include "../algorithms/strings/rabin-karp.hpp"
#include "../algorithms/strings/suffix-array.hpp"
#include "../algorithms/strings/z-function.hpp"
using namespace algs;
int main(int argc, char** argv) {
if (argc != 2) return 2; std::ifstream input(argv[1]); std::string raw((std::istreambuf_iterator<char>(input)), {}); auto fixtures = Json::parse(raw); int passed = 0;
auto check = [&](std::size_t index, Json actual) { auto expected = fixtures.at(index).at("expected"); if (!(actual == expected)) throw std::runtime_error(fixtures.at(index).at("name").string() + ": " + actual.dump() + " != " + expected.dump()); ++passed; };
check(0, Json(bubbleSort(Numbers{3,-1,3,0})));
check(1, Json(cocktailShakerSort(Numbers{3,-1,3,0})));
check(2, Json(selectionSort(Numbers{3,-1,3,0})));
check(3, Json(insertionSort(Numbers{3,-1,3,0})));
check(4, Json(shellSort(Numbers{3,-1,3,0})));
check(5, Json(mergeSort(Numbers{3,-1,3,0})));
check(6, Json(bottomUpMergeSort(Numbers{3,-1,3,0})));
check(7, Json(quickSort(Numbers{3,-1,3,0})));
check(8, Json(quickSortFunctional(Numbers{3,-1,3,0})));
check(9, Json(heapSort(Numbers{3,-1,3,0})));
check(10, Json(countingSort(Numbers{3,-1,3,0})));
check(11, Json(radixSort(Numbers{3,-1,3,0})));
check(12, Json(bucketSort(Numbers{3,-1,3,0})));
check(13, Json(timSort(Numbers{3,-1,3,0})));
check(14, Json(linearSearch(Numbers{4,1,4}, 4.0)));
check(15, Json(binarySearch(Numbers{1,3,5,7}, 5.0)));
check(16, Json(jumpSearch(Numbers{1,3,5,7}, 5.0)));
check(17, Json(interpolationSearch(Numbers{1,3,5,7}, 5.0)));
check(18, Json(exponentialSearch(Numbers{1,3,5,7}, 5.0)));
check(19, Json(quickSelect(Numbers{7,10,4,3,20,15}, 2)));
check(20, Json(median(Numbers{1,5,3,7})));
check(21, Json(fibonacciRecursive(10)));
check(22, Json(fibonacci(100)));
check(23, Json(fibonacciFast(100)));
check(24, Json(editDistance("kitten", "sitting")));
check(25, Json(coinChangeWays(Numbers{1,2,5}, 5)));
check(26, Json(uniquePaths(3, 7)));
check(27, Json(minPathSum(Matrix{{1,3,1},{1,5,1},{4,2,1}})));
check(28, Json(canPartition(Numbers{1,5,11,5})));
check(29, Json(prefixFunction("ababaca")));
check(30, Json(kmpSearch("aaaaa", "aa")));
check(31, Json(zFunction("aaaaa")));
check(32, Json(rabinKarp("aaaaa", "aa")));
check(33, Json(boyerMooreHorspool("aaaaa", "aa")));
check(34, Json(longestPalindromicSubstring("forgeeksskeegfor")));
check(35, Json(suffixArray("banana")));
check(36, Json(gcd(-48, 18)));
check(37, Json(lcm(21, 6)));
{ auto result = extendedGcd(240, 46); check(38, Json::Object{{"gcd", result.gcd}, {"x", result.x}, {"y", result.y}}); }
check(39, Json(modInverse(3, 11)));
check(40, Json(fastPower(2, 10)));
check(41, Json(integerSqrt(80)));
check(42, Json(sieveOfEratosthenes(30)));
{ auto result = linearSieve(10); check(43, Json::Object{{"primes", result.primes}, {"smallestFactor", result.smallestFactor}}); }
check(44, Json(isPrime(97)));
{ Json::Array entries; for (auto [prime, count] : primeFactors(360)) entries.emplace_back(Json::Array{Json(prime), Json(count)}); check(45, entries); }
check(46, Json(divisors(36)));
check(47, Json(eulerPhi(36)));
check(48, Json(factorial(30)));
check(49, Json(binomial(50, 25)));
check(50, Json(catalan(20)));
check(51, Json(toRoman(2026)));
check(52, Json(fromRoman("MMXXVI")));
check(53, Json(multiply(Matrix{{1,2},{3,4}}, Matrix{{5,6},{7,8}})));
check(54, Json(determinant(Matrix{{1,2},{3,4}})));
check(55, Json(countNQueens(4)));
check(56, Json(wordSearch(std::vector<std::string>{"ABCE","SFCS","ADEE"}, "ABCCED")));
check(57, Json(canReachEnd(Numbers{3,2,1,0,4})));
check(58, Json(minJumps(Numbers{2,3,1,1,4})));
check(59, Json(reverseBits(1)));
check(60, Json(countSetBits(4294967295)));
check(61, Json(topologicalSortKahn(AdjacencyList{{1,2},{3},{3},{}})));
check(62, Json(isBipartite(AdjacencyList{{1,2},{0,2},{0,1}})));
check(63, Json(edmondsKarp(Matrix{{0,3,2,0},{0,0,1,2},{0,0,0,3},{0,0,0,0}}, 0, 3)));
std::cout << "C++: " << passed << " reference cases passed\n";
}
