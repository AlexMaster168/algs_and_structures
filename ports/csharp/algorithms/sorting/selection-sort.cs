using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static T[] SelectionSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var a = input.ToArray();
        for (var i = 0; i < a.Length - 1; i++)
        {
            var min = i;
            for (var j = i + 1; j < a.Length; j++) if (compare(a[j], a[min]) < 0) min = j;
            if (min != i) (a[i], a[min]) = (a[min], a[i]);
        }
        return a;
    }
}
