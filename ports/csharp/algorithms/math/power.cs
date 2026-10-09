using System.Numerics;
namespace Algorithms.Mathematics;
public static partial class Numbers
{
    public static double FastPower(double value, int exponent) { if (exponent < 0) return 1 / FastPower(value, -exponent); var result = 1d; while (exponent > 0) { if ((exponent & 1) != 0) result *= value; value *= value; exponent /= 2; } return result; }
    public static BigInteger ModPow(BigInteger value, BigInteger exponent, BigInteger modulus) { if (modulus == 1) return 0; BigInteger result = 1; value %= modulus; if (value < 0) value += modulus; while (exponent > 0) { if (!exponent.IsEven) result = result * value % modulus; value = value * value % modulus; exponent >>= 1; } return result; }
    public static double IntegerSqrt(double n) { if (n < 0) throw new ArgumentOutOfRangeException(nameof(n)); if (n < 2) return n; var x = n; var y = Math.Floor((x + 1) / 2); while (y < x) { x = y; y = Math.Floor((x + Math.Floor(n / x)) / 2); } return x; }
    public static double NewtonSqrt(double n, double epsilon = 1e-12) { if (n < 0) throw new ArgumentOutOfRangeException(nameof(n)); if (n == 0) return 0; var x = n; while (Math.Abs(x * x - n) > epsilon * n) x = (x + n / x) / 2; return x; }
}
