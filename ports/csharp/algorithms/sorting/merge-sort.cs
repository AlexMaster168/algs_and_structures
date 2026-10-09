using Algorithms.Shared;
namespace Algorithms.Sorting;
public static partial class Sort
{
    public static T[] Merge<T>(IReadOnlyList<T> left, IReadOnlyList<T> right, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var result = new List<T>(); var i = 0; var j = 0;
        while (i < left.Count && j < right.Count) result.Add(compare(left[i], right[j]) <= 0 ? left[i++] : right[j++]);
        while (i < left.Count) result.Add(left[i++]); while (j < right.Count) result.Add(right[j++]); return result.ToArray();
    }
    public static T[] MergeSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        if (input.Count <= 1) return input.ToArray(); var m = input.Count >> 1;
        return Merge(MergeSort(input.Take(m).ToArray(), compare), MergeSort(input.Skip(m).ToArray(), compare), compare);
    }
    public static T[] BottomUpMergeSort<T>(IReadOnlyList<T> input, Comparator<T>? compare = null)
    {
        compare ??= Compare.DefaultCompare; var source = input.ToArray(); var target = new T[source.Length];
        for (var width = 1; width < source.Length; width *= 2)
        {
            for (var left = 0; left < source.Length; left += 2 * width)
            {
                var middle = Math.Min(left + width, source.Length); var right = Math.Min(left + 2 * width, source.Length);
                var i = left; var j = middle; var k = left;
                while (i < middle && j < right) target[k++] = compare(source[i], source[j]) <= 0 ? source[i++] : source[j++];
                while (i < middle) target[k++] = source[i++]; while (j < right) target[k++] = source[j++];
            }
            (source, target) = (target, source);
        }
        return source;
    }
}
