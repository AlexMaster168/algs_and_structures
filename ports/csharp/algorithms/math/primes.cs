using System.Numerics;
namespace Algorithms.Mathematics;
public static partial class Numbers
{
    public static int[] SieveOfEratosthenes(int limit) { if (limit < 2) return []; var composite = new bool[limit + 1]; var primes = new List<int>(); for (var i = 2; i <= limit; i++) { if (composite[i]) continue; primes.Add(i); for (long j = (long)i * i; j <= limit; j += i) composite[j] = true; } return primes.ToArray(); }
    public static (int[] Primes, int[] SmallestFactor) LinearSieve(int limit) { var factors = new int[limit + 1]; var primes = new List<int>(); for (var i = 2; i <= limit; i++) { if (factors[i] == 0) { factors[i] = i; primes.Add(i); } foreach (var p in primes) { if (p > factors[i] || (long)i * p > limit) break; factors[i * p] = p; } } return (primes.ToArray(), factors); }
    public static bool IsPrime(double n) { if (n < 2) return false; if (n < 4) return true; if (n % 2 == 0 || n % 3 == 0) return false; for (long i = 5; i * i <= n; i += 6) if (n % i == 0 || n % (i + 2) == 0) return false; return true; }
    public static bool MillerRabin(BigInteger n) { if (n < 2) return false; int[] primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]; foreach (var p in primes) { if (n == p) return true; if (n % p == 0) return false; } var d = n - 1; var r = 0; while (d.IsEven) { d >>= 1; r++; } foreach (var a in primes) { var x = ModPow(a, d, n); if (x == 1 || x == n - 1) continue; var passed = false; for (var i = 1; i < r; i++) { x = x * x % n; if (x == n - 1) { passed = true; break; } } if (!passed) return false; } return true; }
    public static Dictionary<double, int> PrimeFactors(double n) { var factors = new Dictionary<double, int>(); for (var p = 2d; p * p <= n; p++) while (n % p == 0) { factors[p] = factors.GetValueOrDefault(p) + 1; n /= p; } if (n > 1) factors[n] = factors.GetValueOrDefault(n) + 1; return factors; }
    public static double[] Divisors(double n) { var small = new List<double>(); var large = new List<double>(); for (var i = 1d; i * i <= n; i++) { if (n % i != 0) continue; small.Add(i); if (i != n / i) large.Add(n / i); } large.Reverse(); return [..small, ..large]; }
    public static double EulerPhi(double n) { var result = n; foreach (var p in PrimeFactors(n).Keys) result -= result / p; return result; }
}
