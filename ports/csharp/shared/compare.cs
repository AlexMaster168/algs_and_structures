namespace Algorithms.Shared;

public delegate int Comparator<in T>(T a, T b);

public static class Compare
{
    public static int DefaultCompare<T>(T a, T b) => Comparer<T>.Default.Compare(a, b);
    public static Comparator<T> ReverseCompare<T>(Comparator<T>? compare = null) => (a, b) => (compare ?? DefaultCompare)(b, a);
}
