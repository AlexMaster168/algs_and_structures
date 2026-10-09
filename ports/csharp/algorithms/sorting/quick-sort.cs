using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static (int LessEnd, int GreaterStart) Partition3<T>(T[] a, int low, int high, Comparator<T> compare)
    {
        var pivot = a[Random.Shared.Next(low, high + 1)]; var lt = low; var gt = high; var i = low;
        while (i <= gt)
        {
            var order = compare(a[i], pivot);
            if (order < 0) { (a[lt], a[i]) = (a[i], a[lt]); lt++; i++; }
            else if (order > 0) { (a[i], a[gt]) = (a[gt], a[i]); gt--; } else i++;
        }
        return (lt, gt);
    }
    public static T[] QuickSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var a = input.ToArray(); var stack = new Stack<(int, int)>(); stack.Push((0, a.Length - 1));
        while (stack.TryPop(out var range))
        {
            var (low, high) = range; if (low >= high) continue;
            var (lt, gt) = Partition3(a, low, high, compare); stack.Push((low, lt - 1)); stack.Push((gt + 1, high));
        }
        return a;
    }
    public static int LomutoPartition<T>(T[] a, int low, int high, Comparator<T> compare)
    {
        var pivot = a[high]; var boundary = low;
        for (var i = low; i < high; i++) if (compare(a[i], pivot) < 0) { (a[boundary], a[i]) = (a[i], a[boundary]); boundary++; }
        (a[boundary], a[high]) = (a[high], a[boundary]); return boundary;
    }
    public static T[] QuickSortFunctional<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        if (input.Count <= 1) return input.ToArray(); compare ??= Compare.DefaultCompare; var pivot = input[0];
        var less = input.Skip(1).Where(x => compare(x, pivot) < 0).ToArray(); var greater = input.Skip(1).Where(x => compare(x, pivot) >= 0).ToArray();
        return [..QuickSortFunctional(less, compare), pivot, ..QuickSortFunctional(greater, compare)];
    }
}
