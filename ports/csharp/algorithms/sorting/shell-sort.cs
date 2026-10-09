using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static T[] ShellSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var a = input.ToArray(); var gap = 1;
        while (gap < a.Length / 3) gap = gap * 3 + 1;
        for (; gap >= 1; gap = (gap - 1) / 3)
            for (var i = gap; i < a.Length; i++)
            {
                var current = a[i]; var j = i;
                while (j >= gap && compare(a[j - gap], current) > 0) { a[j] = a[j - gap]; j -= gap; }
                a[j] = current;
            }
        return a;
    }
}
