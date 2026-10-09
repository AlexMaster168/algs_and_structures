using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static T[] BubbleSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare;
        var a = input.ToArray();
        for (var end = a.Length - 1; end > 0; end--)
        {
            var swapped = false;
            for (var i = 0; i < end; i++)
                if (compare(a[i], a[i + 1]) > 0) { (a[i], a[i + 1]) = (a[i + 1], a[i]); swapped = true; }
            if (!swapped) break;
        }
        return a;
    }
}
