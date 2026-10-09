using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static T[] CocktailShakerSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var a = input.ToArray(); var start = 0; var end = a.Length - 1; var swapped = true;
        void SwapIfGreater(int i) { if (compare(a[i], a[i + 1]) > 0) { (a[i], a[i + 1]) = (a[i + 1], a[i]); swapped = true; } }
        while (swapped && start < end)
        {
            swapped = false; for (var i = start; i < end; i++) SwapIfGreater(i); end--;
            if (!swapped) break;
            swapped = false; for (var i = end - 1; i >= start; i--) SwapIfGreater(i); start++;
        }
        return a;
    }
}
