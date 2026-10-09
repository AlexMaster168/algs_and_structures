namespace Algorithms.Searching;
public static partial class Search
{
    public static double TernarySearchMax(Func<double, double> f, double low, double high, double epsilon = 1e-9)
    { while (high - low > epsilon) { var m1 = low + (high - low) / 3; var m2 = high - (high - low) / 3; if (f(m1) < f(m2)) low = m1; else high = m2; } return (low + high) / 2; }
    public static double TernarySearchMin(Func<double, double> f, double low, double high, double epsilon = 1e-9) => TernarySearchMax(x => -f(x), low, high, epsilon);
    public static int FindPeakIndex(IReadOnlyList<double> a) { var l = 0; var h = a.Count - 1; while (l < h) { var m = (l + h) >> 1; if (a[m] < a[m + 1]) l = m + 1; else h = m; } return l; }
}
