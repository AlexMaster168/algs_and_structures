using System.Numerics;
namespace Algorithms.Mathematics;
public static partial class Numbers
{
    public static BigInteger Factorial(int n) { if (n < 0) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result = 1; for (var i = 2; i <= n; i++) result *= i; return result; }
    public static BigInteger Binomial(int n, int k) { if (k < 0 || k > n) return 0; k = Math.Min(k, n - k); BigInteger result = 1; for (var i = 1; i <= k; i++) result = result * (n - k + i) / i; return result; }
    public static double[][] PascalTriangle(int rows) { var triangle = new List<double[]>(); for (var r = 0; r < rows; r++) { var row = new double[r + 1]; row[0] = row[^1] = 1; for (var c = 1; c < r; c++) row[c] = triangle[r - 1][c - 1] + triangle[r - 1][c]; triangle.Add(row); } return triangle.ToArray(); }
    public static BigInteger Catalan(int n) => Binomial(2 * n, n) / (n + 1);
    public static bool NextPermutation(double[] values) { var i = values.Length - 2; while (i >= 0 && values[i] >= values[i + 1]) i--; if (i < 0) { Array.Reverse(values); return false; } var j = values.Length - 1; while (values[j] <= values[i]) j--; (values[i], values[j]) = (values[j], values[i]); for (int l = i + 1, r = values.Length - 1; l < r; l++, r--) (values[l], values[r]) = (values[r], values[l]); return true; }
}
