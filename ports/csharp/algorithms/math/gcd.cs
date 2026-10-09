namespace Algorithms.Mathematics;
public static partial class Numbers
{
    public static double Gcd(double a, double b) { a = Math.Abs(a); b = Math.Abs(b); while (b != 0) (a, b) = (b, a % b); return a; }
    public static double Lcm(double a, double b) => a == 0 || b == 0 ? 0 : Math.Abs(a / Gcd(a, b) * b);
    public static (double Gcd, double X, double Y) ExtendedGcd(double a, double b) { if (b == 0) return (a, 1, 0); var (g, x, y) = ExtendedGcd(b, a % b); return (g, y, x - Math.Floor(a / b) * y); }
    public static double? ModInverse(double a, double m) { var (g, x, _) = ExtendedGcd((a % m + m) % m, m); return g == 1 ? (x % m + m) % m : null; }
}
