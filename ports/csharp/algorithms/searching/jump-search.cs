namespace Algorithms.Searching;
public static partial class Search
{
    public static int JumpSearch(IReadOnlyList<double> a, double target)
    { if (a.Count == 0) return -1; var step = (int)Math.Sqrt(a.Count); var previous = 0; var current = step; while (current < a.Count && a[current - 1] < target) { previous = current; current += step; } for (var i = previous; i < Math.Min(current, a.Count); i++) if (a[i] == target) return i; return -1; }
}
