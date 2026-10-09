namespace Algorithms.Searching;
public static partial class Search
{
    public static int InterpolationSearch(IReadOnlyList<double> a, double target)
    {
        var l = 0; var h = a.Count - 1; while (l <= h && target >= a[l] && target <= a[h])
        { if (a[h] == a[l]) return a[l] == target ? l : -1; var p = l + (int)Math.Floor((target - a[l]) * (h - l) / (a[h] - a[l])); if (a[p] == target) return p; if (a[p] < target) l = p + 1; else h = p - 1; } return -1;
    }
}
