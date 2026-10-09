using Algorithms.Shared;
using Algorithms.Sorting;
namespace Algorithms.Searching;
public static partial class Search
{
    public static T QuickSelect<T>(IReadOnlyList<T> input, int k, Comparator<T>? compare = null)
    {
        if (k < 0 || k >= input.Count) throw new ArgumentOutOfRangeException(nameof(k)); compare ??= Compare.DefaultCompare; var a = input.ToArray(); var l = 0; var h = a.Length - 1;
        while (true) { var pivot = Random.Shared.Next(l, h + 1); (a[pivot], a[h]) = (a[h], a[pivot]); var p = Sort.LomutoPartition(a, l, h, compare); if (p == k) return a[p]; if (p < k) l = p + 1; else h = p - 1; }
    }
    public static double Median(IReadOnlyList<double> values) { if (values.Count == 0) throw new ArgumentException("Array must not be empty"); var m = values.Count >> 1; return values.Count % 2 == 1 ? QuickSelect(values, m) : (QuickSelect(values, m - 1) + QuickSelect(values, m)) / 2; }
}
