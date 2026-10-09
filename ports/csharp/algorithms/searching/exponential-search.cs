using Algorithms.Shared;
namespace Algorithms.Searching;
public static partial class Search
{
    public static int ExponentialSearch<T>(IReadOnlyList<T> a, T target, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; if (a.Count == 0) return -1; if (compare(a[0], target) == 0) return 0;
        var bound = 1; while (bound < a.Count && compare(a[bound], target) < 0) bound *= 2;
        return BinarySearch(a, target, compare, bound >> 1, Math.Min(bound, a.Count - 1));
    }
}
