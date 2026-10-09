using System.Numerics;
namespace Algorithms.DynamicProgramming;
public static partial class Dynamic
{
    public static double FibonacciRecursive(int n) => n < 2 ? n : FibonacciRecursive(n - 1) + FibonacciRecursive(n - 2);
    private static readonly Memoized<int, double> FibonacciCache = Memoize<int, double>(n => n < 2 ? n : FibonacciMemo(n - 1) + FibonacciMemo(n - 2));
    public static double FibonacciMemo(int n) => FibonacciCache.Invoke(n);
    public static BigInteger Fibonacci(int n) { BigInteger previous = 0, current = 1; if (n == 0) return previous; for (var i = 1; i < n; i++) (previous, current) = (current, previous + current); return current; }
    public static BigInteger FibonacciFast(int n) { (BigInteger, BigInteger) Pair(int k) { if (k == 0) return (0, 1); var (a, b) = Pair(k >> 1); var c = a * (2 * b - a); var d = a * a + b * b; return (k & 1) != 0 ? (d, c + d) : (c, d); } return Pair(n).Item1; }
}
