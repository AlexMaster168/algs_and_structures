namespace Algorithms.DataStructures.RangeQueries;
public class FenwickTree
{
    private readonly double[] tree; public int Size => tree.Length - 1;
    public FenwickTree(int size) { tree = new double[size + 1]; }
    public FenwickTree(IReadOnlyList<double> values) { tree = new double[values.Count + 1]; for (var i = 1; i <= values.Count; i++) tree[i] = values[i - 1]; for (var i = 1; i <= values.Count; i++) { var p = i + (i & -i); if (p <= values.Count) tree[p] += tree[i]; } }
    public void Add(int index, double delta) { if (index < 0 || index >= Size) throw new ArgumentOutOfRangeException(nameof(index)); for (var i = index + 1; i < tree.Length; i += i & -i) tree[i] += delta; }
    public void Set(int index, double value) => Add(index, value - RangeSum(index, index));
    public double PrefixSum(int index) { var sum = 0d; for (var i = Math.Min(index + 1, Size); i > 0; i -= i & -i) sum += tree[i]; return sum; }
    public double RangeSum(int left, int right) => PrefixSum(right) - (left > 0 ? PrefixSum(left - 1) : 0);
}
