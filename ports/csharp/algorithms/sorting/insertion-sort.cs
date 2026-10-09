using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static void InsertionSortRange<T>(T[] a, int left, int right, Comparator<T> compare)
    {
        for (var i = left + 1; i <= right; i++)
        {
            var current = a[i]; var j = i - 1;
            while (j >= left && compare(a[j], current) > 0) { a[j + 1] = a[j]; j--; }
            a[j + 1] = current;
        }
    }
    public static T[] InsertionSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        var a = input.ToArray(); InsertionSortRange(a, 0, a.Length - 1, compare ?? Compare.DefaultCompare); return a;
    }
}
