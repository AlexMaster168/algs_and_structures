namespace Algorithms.Searching;
public static partial class Search
{
    public static int LinearSearch<T>(IReadOnlyList<T> a, T target) { for (var i = 0; i < a.Count; i++) if (EqualityComparer<T>.Default.Equals(a[i], target)) return i; return -1; }
    public static int[] LinearSearchAll<T>(IReadOnlyList<T> a, Func<T, int, bool> predicate) { var indices = new List<int>(); for (var i = 0; i < a.Count; i++) if (predicate(a[i], i)) indices.Add(i); return indices.ToArray(); }
}
