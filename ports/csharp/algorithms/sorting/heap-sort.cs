using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    private static void SiftDown<T>(T[] a, int start, int end, Comparator<T> compare)
    {
        var root = start;
        while (true)
        {
            var left = 2 * root + 1; var right = left + 1; var largest = root;
            if (left < end && compare(a[left], a[largest]) > 0) largest = left;
            if (right < end && compare(a[right], a[largest]) > 0) largest = right;
            if (largest == root) return;
            (a[root], a[largest]) = (a[largest], a[root]); root = largest;
        }
    }
    public static T[] HeapSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var a = input.ToArray();
        for (var i = (a.Length >> 1) - 1; i >= 0; i--) SiftDown(a, i, a.Length, compare);
        for (var end = a.Length - 1; end > 0; end--) { (a[0], a[end]) = (a[end], a[0]); SiftDown(a, 0, end, compare); }
        return a;
    }
}
