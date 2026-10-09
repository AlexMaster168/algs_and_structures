using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static T[] TimSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var a = input.ToArray(); var run = a.Length; var remainder = 0;
        while (run >= 32) { remainder |= run & 1; run >>= 1; } run += remainder;
        if (run == 0) return a;
        for (var start = 0; start < a.Length; start += run) InsertionSortRange(a, start, Math.Min(start + run - 1, a.Length - 1), compare);
        for (var size = run; size < a.Length; size *= 2)
            for (var left = 0; left < a.Length; left += 2 * size)
            {
                var middle = left + size - 1; var right = Math.Min(left + 2 * size - 1, a.Length - 1);
                if (middle < right) { var merged = Merge(a[left..(middle + 1)], a[(middle + 1)..(right + 1)], compare); Array.Copy(merged, 0, a, left, merged.Length); }
            }
        return a;
    }
}
