namespace Algorithms.DataStructures.RangeQueries;
public class LazySegmentTree
{
    private readonly double[] sums, pending; public int Size { get; }
    public LazySegmentTree(IReadOnlyList<double> values) { Size = values.Count; sums = new double[4 * Math.Max(1, Size)]; pending = new double[sums.Length]; if (Size > 0) Build(1, 0, Size - 1, values); }
    private void Build(int n, int s, int e, IReadOnlyList<double> values) { if (s == e) { sums[n] = values[s]; return; } var m = (s + e) >> 1; Build(2 * n, s, m, values); Build(2 * n + 1, m + 1, e, values); sums[n] = sums[2 * n] + sums[2 * n + 1]; }
    private void Apply(int n, int s, int e, double delta) { sums[n] += delta * (e - s + 1); pending[n] += delta; }
    private void Push(int n, int s, int e) { var delta = pending[n]; if (delta == 0) return; var m = (s + e) >> 1; Apply(2 * n, s, m, delta); Apply(2 * n + 1, m + 1, e, delta); pending[n] = 0; }
    private void AssertRange(int l, int r) { if (l < 0 || r >= Size || l > r) throw new ArgumentOutOfRangeException(nameof(l)); }
    public void RangeAdd(int left, int right, double delta) { AssertRange(left, right); Add(1, 0, Size - 1, left, right, delta); }
    private void Add(int n, int s, int e, int l, int r, double d) { if (r < s || e < l) return; if (l <= s && e <= r) { Apply(n, s, e, d); return; } Push(n, s, e); var m = (s + e) >> 1; Add(2 * n, s, m, l, r, d); Add(2 * n + 1, m + 1, e, l, r, d); sums[n] = sums[2 * n] + sums[2 * n + 1]; }
    public double RangeSum(int left, int right) { AssertRange(left, right); return Sum(1, 0, Size - 1, left, right); }
    private double Sum(int n, int s, int e, int l, int r) { if (r < s || e < l) return 0; if (l <= s && e <= r) return sums[n]; Push(n, s, e); var m = (s + e) >> 1; return Sum(2 * n, s, m, l, r) + Sum(2 * n + 1, m + 1, e, l, r); }
}
