namespace Algorithms.DataStructures.RangeQueries;
public class SparseTable<T>
{
    private readonly List<T[]> table; private readonly int[] log; private readonly Func<T, T, T> combine;
    public SparseTable(IReadOnlyList<T> values, Func<T, T, T> combine) { this.combine = combine; log = new int[values.Count + 1]; for (var i = 2; i <= values.Count; i++) log[i] = log[i >> 1] + 1; table = [values.ToArray()]; for (var level = 1; 1 << level <= values.Count; level++) { var previous = table[level - 1]; var half = 1 << (level - 1); var row = new T[values.Count - (1 << level) + 1]; for (var i = 0; i < row.Length; i++) row[i] = combine(previous[i], previous[i + half]); table.Add(row); } }
    public T Query(int left, int right) { if (left < 0 || right >= table[0].Length || left > right) throw new ArgumentOutOfRangeException(nameof(left)); var level = log[right - left + 1]; return combine(table[level][left], table[level][right - (1 << level) + 1]); }
}
public static partial class Range
{
    public static SparseTable<double> MinSparseTable(IReadOnlyList<double> values) => new(values, Math.Min);
    public static SparseTable<double> MaxSparseTable(IReadOnlyList<double> values) => new(values, Math.Max);
}
