using Algorithms.Shared;
namespace Algorithms.Searching;
public static partial class Search
{
    public static int BinarySearch<T>(IReadOnlyList<T> a, T target, Comparator<T>? compare = null, int low = 0, int? high = null)
    {
        compare ??= Compare.DefaultCompare; var h = high ?? a.Count - 1;
        while (low <= h) { var m = low + ((h - low) >> 1); var c = compare(a[m], target); if (c == 0) return m; if (c < 0) low = m + 1; else h = m - 1; } return -1;
    }
    public static int BinarySearchRecursive<T>(IReadOnlyList<T> a, T target, Comparator<T>? compare = null, int low = 0, int? high = null)
    {
        compare ??= Compare.DefaultCompare; var h = high ?? a.Count - 1; if (low > h) return -1; var m = low + ((h - low) >> 1); var c = compare(a[m], target);
        return c == 0 ? m : c < 0 ? BinarySearchRecursive(a, target, compare, m + 1, h) : BinarySearchRecursive(a, target, compare, low, m - 1);
    }
    public static int LowerBound<T>(IReadOnlyList<T> a, T target, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var l = 0; var h = a.Count; while (l < h) { var m = (l + h) >> 1; if (compare(a[m], target) < 0) l = m + 1; else h = m; } return l;
    }
    public static int UpperBound<T>(IReadOnlyList<T> a, T target, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var l = 0; var h = a.Count; while (l < h) { var m = (l + h) >> 1; if (compare(a[m], target) <= 0) l = m + 1; else h = m; } return l;
    }
    public static int FirstTrue(int low, int high, Func<int, bool> predicate)
    { while (low < high) { var m = low + (high - low) / 2; if (predicate(m)) high = m; else low = m + 1; } return low; }
}
