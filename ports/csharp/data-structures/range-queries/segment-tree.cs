namespace Algorithms.DataStructures.RangeQueries;
public class SegmentTree<T>
{
    private readonly T[] tree; private readonly Func<T, T, T> combine; private readonly T identity; public int Size { get; }
    public SegmentTree(IReadOnlyList<T> values, Func<T, T, T> combine, T identity) { Size = values.Count; this.combine = combine; this.identity = identity; tree = Enumerable.Repeat(identity, 2 * Size).ToArray(); for (var i = 0; i < Size; i++) tree[Size + i] = values[i]; for (var i = Size - 1; i > 0; i--) tree[i] = combine(tree[2 * i], tree[2 * i + 1]); }
    private void AssertIndex(int i) { if (i < 0 || i >= Size) throw new ArgumentOutOfRangeException(nameof(i)); }
    public T Get(int index) { AssertIndex(index); return tree[Size + index]; }
    public void Update(int index, T value) { AssertIndex(index); var p = Size + index; tree[p] = value; for (p >>= 1; p > 0; p >>= 1) tree[p] = combine(tree[2 * p], tree[2 * p + 1]); }
    public T Query(int left, int right) { if (left < 0 || right >= Size || left > right) throw new ArgumentOutOfRangeException(nameof(left)); var a = identity; var b = identity; for (int l = left + Size, r = right + Size + 1; l < r; l >>= 1, r >>= 1) { if ((l & 1) != 0) a = combine(a, tree[l++]); if ((r & 1) != 0) b = combine(tree[--r], b); } return combine(a, b); }
}
public static partial class Range
{
    public static SegmentTree<double> SumSegmentTree(IReadOnlyList<double> values) => new(values, (a, b) => a + b, 0);
    public static SegmentTree<double> MinSegmentTree(IReadOnlyList<double> values) => new(values, Math.Min, double.PositiveInfinity);
    public static SegmentTree<double> MaxSegmentTree(IReadOnlyList<double> values) => new(values, Math.Max, double.NegativeInfinity);
}
